import { ActionRowBuilder, PermissionsBitField, StringSelectMenuBuilder } from 'discord.js';
import eventHandler from "../../../../index.js";
import BasicCommand from "../../basicCommand.js";
import fs from "fs";

class CancelReminderCommand extends BasicCommand {
    constructor() {
        super('admin_cancelreminder', 'Annule un événement programmé.');
    }

    async handleCommand(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({
                content: '🚫 Vous devez être administrateur pour utiliser cette commande.',
                ephemeral: true,
            });
        }

        // Récupérer la liste des événements programmés
        const scheduledEvents = eventHandler.getScheduledEvents();

        // Vérifier s'il y a des événements programmés
        if (scheduledEvents.length === 0) {
            return await interaction.reply({
                content: '❌ Aucun événement programmé disponible à annuler.',
                ephemeral: true,
            });
        }

        const seenEventIDs = new Set();
        const uniqueScheduledEvents = scheduledEvents.filter(event => {
            if (seenEventIDs.has(event.eventID)) {
                return false;
            } else {
                seenEventIDs.add(event.eventID);
                return true;
            }
        });

        // Créer le menu de sélection pour choisir l'événement à annuler
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('cancel_event_poll')
            .setPlaceholder('Choisissez un événement à annuler')
            .addOptions(uniqueScheduledEvents.map(event => ({
                label: event.eventName,
                description: `Annuler l’événement ${event.eventName}`,
                value: event.eventID,
            })));

        const row = new ActionRowBuilder().addComponents(selectMenu);

        // Envoyer le sondage pour sélectionner l'événement à annuler
        await interaction.reply({
            content: 'Choisissez un événement à annuler.',
            components: [row],
            ephemeral: true,
        });

        // Créer un collecteur pour l'interaction de sélection
        const filter = i => i.customId === 'cancel_event_poll' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            const selectedEventID = i.values[0];

            // Vérifier l'événement sélectionné
            const selectedEvent = scheduledEvents.find(event => event.eventID === selectedEventID);

            if (!selectedEvent) {
                await i.reply({ content: '❌ Événement introuvable.', ephemeral: true });
                return;
            }

            const eventsFilePath = 'src/commandes/admin/reminderCommands/ephemeralEvents.json';
            let events = [];
            if (fs.existsSync(eventsFilePath)) {
                const fileContent = fs.readFileSync(eventsFilePath, 'utf-8');
                events = JSON.parse(fileContent);
            }

            // Find the event in the events array and remove it
            const eventIndex = events.findIndex(e => e.id === selectedEventID);
            if (eventIndex >= 0) {
                await i.reply({
                    content: `✅ L'événement **${selectedEvent.eventName}** a été annulé avec succès.`,
                    ephemeral: true,
                });

                events.splice(eventIndex, 1);
                fs.writeFileSync(eventsFilePath, JSON.stringify(events, null, 2), 'utf-8');

                await eventHandler.registerEvents();

                // Arrêter le collecteur une fois l'événement annulé
                collector.stop();

               // console.log(`Event with ID ${selectedEventID} removed successfully.`);
            } else {
                await i.reply({
                    content: `❌ Événement avec ID ${selectedEventID} introuvable.`,
                    ephemeral: true,
                });

                // Arrêter le collecteur une fois l'événement annulé
                collector.stop();
               // console.log(`Event with ID ${selectedEventID} not found.`);
            }
        });

        collector.on('end', async (collected) => {
            if (collected.size === 0) {
                collector.stop();
                await new Promise(resolve => setTimeout(resolve, 100));
                await interaction.followUp({ content: '❌ Aucun événement sélectionné.', ephemeral: true });
            }
        })
    }

    addOptionalCommandData() {
        // Aucune option supplémentaire nécessaire ici pour la commande
    }
}

export default new CancelReminderCommand();
