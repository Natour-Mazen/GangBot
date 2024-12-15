import { EmbedBuilder, PermissionsBitField } from 'discord.js';
import BasicCommand from "../basicCommand.js";

class ChannelsListCommand extends BasicCommand {
    constructor() {
        super('admin_channelslist', 'Liste tous les salons du serveur avec leur catégorie et leur ID (admin seulement).');
    }

    async handleCommand(interaction) {
        // Vérification des permissions administrateur
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({
                content: '🚫 Vous devez être administrateur pour utiliser cette commande.',
                ephemeral: true,
            });
        }

        await interaction.deferReply({ ephemeral: true }); // Optionnel : Donne du temps à la commande pour récupérer les données.

        try {
            // Récupérer tous les salons du serveur
            const channels = await interaction.guild.channels.fetch();
            const categorizedChannels = channels.reduce((acc, channel) => {
                const category = channel.parent ? channel.parent.name : 'Les catégories disponibles';
                if (!acc[category]) acc[category] = [];
                acc[category].push({
                    name: channel.name,
                    id: channel.id,
                });
                return acc;
            }, {});

            // Convertir l'objet en tableau ordonné par catégorie
            const categories = Object.keys(categorizedChannels).sort();

            // Créer un embed pour chaque catégorie de salons
            const embeds = categories.map((category, index) => {
                const channelList = categorizedChannels[category].map(channel => ({
                    name: channel.name,
                    id: channel.id,
                }));

                const embed = new EmbedBuilder()
                    .setColor(0x7289DA)
                    .setTitle(`Catégorie ${index + 1} : ${category}`)
                    .setDescription('Voici les salons disponibles dans cette catégorie :')
                    .setTimestamp();

                channelList.forEach(channel => {
                    embed.addFields({
                        name: channel.name,
                        value: `ID : ${channel.id}`,
                        inline: true,
                    });
                });

                return embed;
            });

            // Répondre avec tous les embeds
            await interaction.editReply({ embeds });
        } catch (error) {
            console.error('Erreur lors de la récupération des salons du serveur :', error);
            await interaction.editReply({
                content: 'Une erreur s\'est produite lors de la récupération des salons.',
                ephemeral: true,
            });
        }
    }

    addOptionalCommandData() {
        // Not needed
    }
}

export default new ChannelsListCommand();
