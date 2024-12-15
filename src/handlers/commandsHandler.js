import { Routes } from 'discord-api-types/v9';
import { config } from "dotenv";
import AdminCommandHandler from './commandsHandlersTypes/adminCommandsHandler.js';
import UsefulCommandHandler from './commandsHandlersTypes/usefulCommandsHandler.js';
import FunCommandHandler from './commandsHandlersTypes/funCommandsHandler.js';

config();

const CLIENT_ID = process.env.DISCORD_BOT_CLIENT_ID;

class CommandHandler {
    constructor(rest) {
        this.rest = rest;
        this.adminHandler = new AdminCommandHandler();
        this.usefulHandler = new UsefulCommandHandler();
        this.funHandler = new FunCommandHandler();
    }

    handleInteraction = async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const commandName = interaction.commandName;

        if (this.adminHandler.commands.some(cmd => cmd.commandData.name === commandName)) {
            await this.adminHandler.handleCommand(commandName, interaction);
        } else if (this.usefulHandler.commands.some(cmd => cmd.commandData.name === commandName)) {
            await this.usefulHandler.handleCommand(commandName, interaction);
        } else if (this.funHandler.commands.some(cmd => cmd.commandData.name === commandName)) {
            await this.funHandler.handleCommand(commandName, interaction);
        }
    }

    async registerCommands() {
        const maxRetries = 5; // Nombre maximal de tentatives
        const retryDelay = 5000; // Délai entre chaque tentative (en millisecondes)
        const timeoutLimit = 3000; // Limite de temps d'attente avant de considérer que la requête est bloquée (en millisecondes)

        for (let retries = 0; retries < maxRetries; retries++) {

            try {
                console.log('Started refreshing application (/) commands.');

                const commandData = [
                    ...this.adminHandler.commands.map(command => command.commandData),
                    ...this.usefulHandler.commands.map(command => command.commandData),
                    ...this.funHandler.commands.map(command => command.commandData),
                ];

                const promise = this.rest.put(Routes.applicationCommands(CLIENT_ID), { body: commandData });

                // Utiliser un délai d'attente pour éviter que la requête soit bloquée indéfiniment
                const result = await Promise.race([
                    promise,
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), timeoutLimit))
                ]);

                console.log('Successfully reloaded application (/) commands.');
                return result; // Sortir de la boucle sur succès
            } catch (err) {
                console.error('Failed to refresh application (/) commands:', err);

                if (retries < maxRetries - 1) {
                    console.log(`Retry ${retries + 1} failed, retrying in ${retryDelay / 1000} seconds...`);
                    await new Promise(resolve => setTimeout(resolve, retryDelay)); // Attendre avant de réessayer
                } else {
                    console.error('Reached maximum retries. Could not refresh application (/) commands.');
                    break; // Arrêter la boucle si toutes les tentatives échouent
                }
            }
        }
    }
}

export default CommandHandler;
