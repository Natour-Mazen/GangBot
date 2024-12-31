import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, PermissionsBitField } from 'discord.js';
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

        if (scheduledEvents.length === 0) {
            return await interaction.reply({
                content: '❌ Aucun événement programmé disponible à annuler.',
                ephemeral: true,
            });
        }

        // Générer une liste des événements disponibles
        const eventsList = scheduledEvents
            .map(event => `• ${event.eventName} (ID: ${event.eventID})`)
            .join('\n');

        // Afficher une modal avec la liste des événements et demander à l'utilisateur d'entrer un ID
        const modal = this.createCancelReminderModal(eventsList);
        await interaction.showModal(modal);

        // Attendre la soumission de la modal
        interaction.awaitModalSubmit({ filter: i => i.customId === 'cancel_reminder_modal', time: 300000 })
            .then(async submittedInteraction => {
                const eventID = submittedInteraction.fields.getTextInputValue('event_id');

                // Vérifier l'événement sélectionné
                const selectedEvent = scheduledEvents.find(event => event.eventID === eventID);

                if (!selectedEvent) {
                    return await submittedInteraction.reply({
                        content: '❌ Aucun événement avec cet ID trouvé. Veuillez réessayer.',
                        ephemeral: true,
                    });
                }

                eventHandler.cancelEvent(eventID);

                await submittedInteraction.reply({
                    content: `✅ L'événement **${selectedEvent.eventName}** a été annulé avec succès.`,
                    ephemeral: true,
                });
            })
            .catch(async error => {
                console.error('Erreur lors de la soumission de la modal :', error);
                await interaction.followUp({ content: '❌ Temps écoulé ou erreur. Veuillez réessayer.', ephemeral: true });
            });
    }

    createCancelReminderModal(eventsList) {
        const modal = new ModalBuilder()
            .setCustomId('cancel_reminder_modal')
            .setTitle('Annuler un rappel');

        const eventsListInput = new TextInputBuilder()
            .setCustomId('events_list')
            .setLabel('Événements disponibles (lecture seule)')
            .setStyle(TextInputStyle.Paragraph)
            .setValue(eventsList)
            .setRequired(false); // Champ non modifiable par l'utilisateur

        const eventIDInput = new TextInputBuilder()
            .setCustomId('event_id')
            .setLabel('ID de l\'événement à annuler')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Exemple : abc123-def456-ghi789')
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder().addComponents(eventIDInput),
            new ActionRowBuilder().addComponents(eventsListInput)
        );

        return modal;
    }

    addOptionalCommandData() {
        // Aucune option supplémentaire nécessaire ici pour la commande
    }
}

export default new CancelReminderCommand();
