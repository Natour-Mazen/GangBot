// import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } from 'discord.js';
// import BasicCommand from "../basicCommand.js";
// import eventHandler from "../../../index.js";
// import MyRecurrenceRule from "../../scheduleEvents/myRecurrenceRule.js";
// import RappelMessageEvent from "../../events/useful/rappelMessageEvent.js";
//
// class CreateReminderCommand extends BasicCommand {
//     constructor() {
//         super('create_reminder', 'Créer un rappel.');
//     }
//
//     addOptionalCommandData() {
//         // Ajouter les options à la commande /create_reminder
//         this.getCommandData()
//             .setName('create_reminder')
//             .setDescription('Créer un rappel.')
//             .addStringOption(option =>
//                 option.setName('second')
//                     .setDescription('Seconde (0-59 ou *)')
//                     .setRequired(false))
//             .addStringOption(option =>
//                 option.setName('minute')
//                     .setDescription('Minute (0-59 ou *)')
//                     .setRequired(false))
//             .addStringOption(option =>
//                 option.setName('hour')
//                     .setDescription('Heure (0-23 ou *)')
//                     .setRequired(false))
//             .addStringOption(option =>
//                 option.setName('day')
//                     .setDescription('Jour (1-31 ou *)')
//                     .setRequired(false))
//             .addStringOption(option =>
//                 option.setName('month')
//                     .setDescription('Mois (0-11 ou *)')
//                     .setRequired(false))
//             .addStringOption(option =>
//                 option.setName('dayofweek')
//                     .setDescription('Jour de la semaine (0-6 ou *)')
//                     .setRequired(false));
//     }
//
//     async handleCommand(interaction) {
//         if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
//             return await interaction.reply({
//                 content: '🚫 Vous devez être administrateur pour utiliser cette commande.',
//                 ephemeral: true,
//             });
//         }
//
//         // Récupérer les options de la commande
//         const second = interaction.options.getString('second') || '*';
//         const minute = interaction.options.getString('minute') || '*';
//         const hour = interaction.options.getString('hour') || '*';
//         const date = interaction.options.getString('day') || '*';
//         const month = interaction.options.getString('month') || '*';
//         const dayOfWeek = interaction.options.getString('dayofweek') || '*';
//
//         // Récupérer les salons et rôles
//         const channels = interaction.guild.channels.cache
//             .filter(channel => channel.isTextBased())
//             .map(channel => ({ label: channel.name, value: channel.id }));
//
//         const roles = interaction.guild.roles.cache
//             .map(role => ({ label: role.name, value: role.id }));
//
//         // Diviser les salons et rôles en groupes si nécessaire
//         const maxOptions = 25;
//         const channelChunks = this.chunkOptions(channels, maxOptions);
//         const roleChunks = this.chunkOptions(roles, maxOptions);
//
//         // Créer la modal de paramètres supplémentaires (étape 2)
//         const modalStep2 = this.createReminderModalStep2(channelChunks, roleChunks);
//
//         // Afficher la modal étape 2
//         if (!interaction.replied) {
//             await interaction.showModal(modalStep2);
//         }
//
//         interaction.awaitModalSubmit({ filter: i => i.customId === 'create_reminder_modal_step2', time: 300000 })
//             .then(async submittedInteraction2 => {
//                 const { channelId, roleId, message, isRecalculated, eventName } = this.getModalValuesStep2(submittedInteraction2);
//
//                 try {
//                     const recurrenceRule = new MyRecurrenceRule(second, minute, hour, date, month, "*", dayOfWeek, "*");
//                     const finalMessage = roleId ? `<@&${roleId}> ${message}` : message;
//
//                     const event = new RappelMessageEvent(
//                         interaction.client,
//                         eventName,
//                         recurrenceRule,
//                         isRecalculated,
//                         channelId,
//                         finalMessage
//                     );
//
//                     eventHandler.registerEvent(event);
//
//                     // Réponse de succès
//                     if (!submittedInteraction2.replied) {
//                         await submittedInteraction2.reply({
//                             content: `✅ L'événement **${eventName}** a été créé avec succès !`,
//                             ephemeral: true
//                         });
//                     }
//                 } catch (error) {
//                     console.error('Erreur lors de la création de l\'événement :', error);
//                     if (!submittedInteraction2.replied) {
//                         await submittedInteraction2.reply({
//                             content: '❌ Une erreur est survenue lors de la création de l\'événement.',
//                             ephemeral: true
//                         });
//                     }
//                 }
//             })
//             .catch(async error => {
//                 console.error('Erreur lors de la soumission de la modal :', error);
//                 if (!interaction.replied) {
//                     await interaction.reply({ content: '❌ Une erreur est survenue. Veuillez réessayer.', ephemeral: true });
//                 }
//             });
//     }
//
//     createReminderModalStep2(channelChunks, roleChunks) {
//         const modal = new ModalBuilder()
//             .setCustomId('create_reminder_modal_step2')
//             .setTitle('Paramètres supplémentaires');
//
//         const nameInput = new TextInputBuilder()
//             .setCustomId('event_name')
//             .setLabel('Nom de l\'événement')
//             .setStyle(TextInputStyle.Short)
//             .setRequired(true);
//
//         const isRecalculatedInput = new TextInputBuilder()
//             .setCustomId('is_recalculated')
//             .setLabel('Est-ce un événement recalculé ? (oui/non)')
//             .setStyle(TextInputStyle.Short)
//             .setRequired(true);
//
//         const messageInput = new TextInputBuilder()
//             .setCustomId('message')
//             .setLabel('Message à envoyer')
//             .setStyle(TextInputStyle.Paragraph)
//             .setRequired(true);
//
//         // Créer des champs de saisie pour les salons
//         const channelInput = new TextInputBuilder()
//             .setCustomId('channel_id')
//             .setLabel('ID du salon (ex: 123456789012345678)')
//             .setStyle(TextInputStyle.Short)
//             .setRequired(true);
//
//         // Créer des champs de saisie pour les rôles
//         const roleInput = new TextInputBuilder()
//             .setCustomId('role_id')
//             .setLabel('ID du rôle (ex: 123456789012345678)')
//             .setStyle(TextInputStyle.Short)
//             .setRequired(true);
//
//         // Ajouter une action supplémentaire pour afficher les IDs
//         const idInfo = new ActionRowBuilder().addComponents(
//             new ButtonBuilder()
//                 .setCustomId('channel_info')
//                 .setLabel(`Salons (${channelChunks.length} pages)`)
//                 .setStyle(ButtonStyle.Link)
//                 .setURL('https://example.com/salons')
//         ).addComponents(
//             new ButtonBuilder()
//                 .setCustomId('role_info')
//                 .setLabel(`Rôles (${roleChunks.length} pages)`)
//                 .setStyle(ButtonStyle.Link)
//                 .setURL('https://example.com/roles')
//         );
//
//         modal.addComponents(
//             new ActionRowBuilder().addComponents(nameInput),
//             new ActionRowBuilder().addComponents(isRecalculatedInput),
//             new ActionRowBuilder().addComponents(messageInput),
//             new ActionRowBuilder().addComponents(channelInput),
//             new ActionRowBuilder().addComponents(roleInput),
//             idInfo
//         );
//
//         return modal;
//     }
//
//     getModalValuesStep2(submittedInteraction) {
//         return {
//             eventName: submittedInteraction.fields.getTextInputValue('event_name'),
//             channelId: submittedInteraction.fields.getTextInputValue('channel_id'),
//             roleId: submittedInteraction.fields.getTextInputValue('role_id'),
//             message: submittedInteraction.fields.getTextInputValue('message'),
//             isRecalculated: submittedInteraction.fields.getTextInputValue('is_recalculated').toLowerCase() === 'oui'
//         };
//     }
//
//     chunkOptions(options, maxOptions) {
//         const chunks = [];
//         for (let i = 0; i < options.length; i += maxOptions) {
//             chunks.push(options.slice(i, i + maxOptions));
//         }
//         return chunks;
//     }
// }
//
// export default new CreateReminderCommand();
