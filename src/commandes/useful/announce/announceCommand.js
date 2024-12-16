import { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } from 'discord.js';
import fs from 'fs';
import BasicCommand from "../../basicCommand.js";

class AnnounceCommand extends BasicCommand {
    constructor() {
        super('announce', 'Annonce un événement');
        this.announceChannelsJsonfilePath = 'src/commandes/useful/announce/announceChannels.json';
    }

    async loadChannelsData() {
        try {
            return JSON.parse(fs.readFileSync(this.announceChannelsJsonfilePath, 'utf8'));
        } catch (error) {
            return {};
        }
    }

    async saveChannelsData(data) {
        fs.writeFileSync(this.announceChannelsJsonfilePath, JSON.stringify(data, null, 2));
    }

    addOptionalCommandData() {
        // no optional command data
    }

    async handleCommand(interaction) {
        let category;
        if(interaction.channel.parent.parent) {
            category = interaction.channel.parent.parent;
        }else {
            category = interaction.channel.parent;
        }
        if(category.id !== '1315784881858412574') { // id de la catégorie EVENEMENTS
            return await interaction.reply({
                content: 'Ce salon n\'est pas dans une catégorie ou les annonces sont autorisées. Veuillez ne pas spammer !',
                ephemeral: true
            });
        }

        const channelID = interaction.channel.id;
        let channelsData = await this.loadChannelsData();

        // Vérifier si le salon est déjà enregistré
        if (channelsData[channelID]) {
            return await interaction.reply({
                content: 'Ce salon a déjà été utilisé pour une annonce. Veuillez ne pas spammer !',
                ephemeral: true
            });
        }

        // Définition du modal
        const modal = this.createAnnouncementModal();

        // Envoi du modal
        await interaction.showModal(modal);

        // Gestion de la soumission du modal
        interaction.awaitModalSubmit({ filter: i => i.customId === 'announceModal', time: 300000 }) // 5 minutes
            .then(async submittedInteraction => {
                const { eventName, eventDate } = this.getModalValues(submittedInteraction);

                // Envoi du message dans le canal d'annonce
                await this.sendAnnouncement(submittedInteraction, eventName, eventDate);

                // Enregistrement de l'ID du salon dans le fichier JSON
                channelsData[channelID] = true;
                await this.saveChannelsData(channelsData);

            })
            .catch(async error => {
                console.error('Erreur lors de la soumission du modal :', error);
                await new Promise(resolve => setTimeout(resolve, 100));
                await interaction.deferReply({ephemeral: true});
                // interaction.reply({ content: 'Une erreur s\'est produite lors de l\'envoi de l\'annonce. Veuillez réessayer plus tard.', ephemeral: true });
            });
    }

    createAnnouncementModal() {
        // Création du modal
        const modal = new ModalBuilder()
            .setCustomId('announceModal')
            .setTitle('Annonce de l\'événement');

        // Champs pour le nom et la date de l'événement
        const eventNameInput = new TextInputBuilder()
            .setCustomId('eventName')
            .setLabel('Nom de l\'événement')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setMaxLength(100);

        const eventDateInput = new TextInputBuilder()
            .setCustomId('eventDate')
            .setLabel('Date de l\'événement')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setMaxLength(50);

        // Création des lignes de composants
        const firstActionRow = new ActionRowBuilder().addComponents(eventNameInput);
        const secondActionRow = new ActionRowBuilder().addComponents(eventDateInput);

        // Ajout des lignes de composants au modal
        modal.addComponents(firstActionRow, secondActionRow);

        return modal;
    }

    getModalValues(submittedInteraction) {
        return {
            eventName: submittedInteraction.fields.getTextInputValue('eventName'),
            eventDate: submittedInteraction.fields.getTextInputValue('eventDate')
        };
    }

    async sendAnnouncement(submittedInteraction, eventName, eventDate) {
        const channel = submittedInteraction.channel;
        const announceChannelID = '1315783772045574164'; // ID du canal d'annonce

        // Message à envoyer dans le canal d'annonce avec lien cliquable
        const announcementMessage = `
        🎉 @everyone 🎉, un événement **${eventName}**  est prévu pour le **${eventDate}** 📅:\n- Pour plus d'infos et pour vous abonner aux mises à jour, cliquez ici : ${channel.url}`;

        // Envoi du message dans le canal d'annonce
        await submittedInteraction.guild.channels.cache.get(announceChannelID).send(announcementMessage);

        // Attendre 1 seconde pour éviter les erreurs de rate limit
        await new Promise(resolve => setTimeout(resolve, 100));

        // Confirmation de l'envoi
        await submittedInteraction.reply({ content: 'Annonce envoyée avec succès ! 👍', ephemeral: true });
    }

}

export default new AnnounceCommand();
