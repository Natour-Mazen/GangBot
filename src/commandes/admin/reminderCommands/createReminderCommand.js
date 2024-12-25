import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } from 'discord.js';
import BasicCommand from "../../basicCommand.js";
import MyRecurrenceRule from "../../../scheduleEvents/myRecurrenceRule.js";
import RappelMessageEvent from "../../../events/useful/rappelMessageEvent.js";
import fs from 'fs';
import eventsHandler from "../../../handlers/eventsHandler.js";
import eventHandler from "../../../../index.js";

class CreateReminderCommand extends BasicCommand {
    constructor() {
        super('admin_createreminder', 'Créer un rappel.');
    }

    addOptionalCommandData() {
        // Ajouter les options à la commande /create_reminder
        this.getCommandData()
            .addChannelOption(option =>
                option.setName('channel')
                    .setDescription('Salon cible')
                    .setRequired(true))
            .addRoleOption(option =>
                option.setName('role')
                    .setDescription('Rôle cible')
                    .setRequired(false));
    }

    async handleCommand(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({
                content: '🚫 Vous devez être administrateur pour utiliser cette commande.',
                ephemeral: true,
            });
        }

        // Récupérer les options de la commande
        const channel = interaction.options.getChannel('channel');
        const role = interaction.options.getRole('role');

        // Créer la modal de paramètres supplémentaires (étape 2)
        const modalStep = this.createReminderModalStep();

        // Afficher la modal étape 2
        if (!interaction.replied) {
            await interaction.showModal(modalStep);
        }

        interaction.awaitModalSubmit({ filter: i => i.customId === 'create_reminder_modal_step2', time: 300000 })
            .then(async submittedInteraction2 => {
                const { message, isRecalculated, eventName, schedule } = this.getModalValuesStep(submittedInteraction2);

                try {
                    const [second, minute, hour, day, month, year] = schedule.split(' ');
                    const recurrenceRule = new MyRecurrenceRule(second, minute, hour, day, month, year, "*", "*");
                    const finalMessage = role ? `<@&${role.id}> ${message}` : message;

                    const event = new RappelMessageEvent(
                        interaction.client,
                        eventName,
                        recurrenceRule,
                        isRecalculated,
                        channel.id,
                        finalMessage
                    );

                    // Étape 1: Charger les événements existants depuis le fichier JSON
                    const eventsFilePath = 'src/commandes/admin/reminderCommands/ephemeralEvents.json';
                    let events = [];
                    if (fs.existsSync(eventsFilePath)) {
                        const fileContent = fs.readFileSync(eventsFilePath, 'utf-8');
                        events = JSON.parse(fileContent);
                    }

                    // Étape 2: Créer une structure sérialisée pour l'événement
                    const eventData = {
                        id: event.getUUID(),
                        name: eventName,
                        message: finalMessage,
                        isRecalculated: isRecalculated,
                        recurrenceRule: event.recurrenceRule.toString(), // Vous pouvez serialiser la règle de récurrence si nécessaire
                        channelId: event.channelId,
                    };

                    // Étape 3: Ajouter le nouvel événement au tableau et le sauvegarder
                    events.push(eventData);
                    fs.writeFileSync(eventsFilePath, JSON.stringify(events, null, 2), 'utf-8');

                    await eventHandler.registerEvents();
                    // Réponse de succès
                    if (!submittedInteraction2.replied) {
                        await submittedInteraction2.reply({
                            content: `✅ L'événement **${eventName}** a été créé avec succès !`,
                            ephemeral: true
                        });
                    }
                } catch (error) {
                    console.error('Erreur lors de la création de l\'événement :', error);
                    if (!submittedInteraction2.replied) {
                        await submittedInteraction2.reply({
                            content: '❌ Une erreur est survenue lors de la création de l\'événement.',
                            ephemeral: true
                        });
                    }
                }
            })
            .catch(async error => {
                console.error('Erreur lors de la soumission de la modal :', error);
                if (!interaction.replied) {
                    await interaction.reply({ content: '❌ Une erreur est survenue. Veuillez réessayer.', ephemeral: true });
                }
            });
    }

    createReminderModalStep() {
        const modal = new ModalBuilder()
            .setCustomId('create_reminder_modal_step2')
            .setTitle('Paramètres supplémentaires');

        const nameInput = new TextInputBuilder()
            .setCustomId('event_name')
            .setLabel('Nom de l\'événement')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const isRecalculatedInput = new TextInputBuilder()
            .setCustomId('is_recalculated')
            .setLabel('Est-ce un événement recalculé ? (oui/non)')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const messageInput = new TextInputBuilder()
            .setCustomId('message')
            .setLabel('Message à envoyer')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const scheduleInfoInput = new TextInputBuilder()
            .setCustomId('schedule_info')
            .setLabel('ℹ️ Format de planification (lecture seule)')
            .setStyle(TextInputStyle.Paragraph)
            .setValue(
                'Format attendu pour "schedule" :\n' +
                '- **secondes** : (0-59) ou *\n' +
                '- **minutes** : (0-59) ou *\n' +
                '- **heures** : (0-23) ou *\n' +
                '- **jour du mois** : (1-31) ou *\n' +
                '- **mois** : (0-11) ou *\n' +
                '- **année** : une année ou *\n\n' +
                'Exemple : 0 0 12 * * * (tous les jours à 12:00)'
            )
            .setRequired(false);

        const scheduleInput = new TextInputBuilder()
            .setCustomId('schedule')
            .setLabel('Rappel (sec min heures jours mois années)')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder().addComponents(nameInput),
            new ActionRowBuilder().addComponents(isRecalculatedInput),
            new ActionRowBuilder().addComponents(messageInput),
            new ActionRowBuilder().addComponents(scheduleInfoInput),
            new ActionRowBuilder().addComponents(scheduleInput)
        );

        return modal;
    }

    getModalValuesStep(submittedInteraction) {
        return {
            eventName: submittedInteraction.fields.getTextInputValue('event_name'),
            message: submittedInteraction.fields.getTextInputValue('message'),
            isRecalculated: submittedInteraction.fields.getTextInputValue('is_recalculated').toLowerCase() === 'oui',
            schedule: submittedInteraction.fields.getTextInputValue('schedule')
        };
    }
}

export default new CreateReminderCommand();
