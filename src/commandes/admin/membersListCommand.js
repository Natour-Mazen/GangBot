import { EmbedBuilder, PermissionsBitField } from 'discord.js';
import BasicCommand from "../basicCommand.js";

class MembersListCommand extends BasicCommand {
    constructor() {
        super('admin_memberslist', 'Liste tous les membres du serveur avec pseudo, tag et ID (admin seulement).');
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
            // Récupérer tous les membres du serveur
            const members = await interaction.guild.members.fetch();
            const memberList = members.map(member => ({
                username: member.user.username,
                tag: member.user.tag,
                id: member.user.id,
            }));

            // Diviser les membres en groupes de 25
            const memberChunks = [];
            while (memberList.length > 0) {
                memberChunks.push(memberList.splice(0, 25));
            }

            // Créer un embed pour chaque groupe de 25 membres
            const embeds = memberChunks.map((chunk, index) => {
                const embed = new EmbedBuilder()
                    .setColor(0x7289DA)
                    .setTitle(`Liste des membres du serveur - Partie ${index + 1}`)
                    .setDescription('Voici les membres disponibles avec leurs informations :')
                    .setTimestamp();

                chunk.forEach(member => {
                    embed.addFields({
                        name: member.tag,
                        value: `Pseudo : ${member.username}\nID : ${member.id}`,
                        inline: true,
                    });
                });

                return embed;
            });

            // Répondre avec tous les embeds
            await interaction.editReply({ embeds });
        } catch (error) {
            console.error('Erreur lors de la récupération des membres du serveur :', error);
            await interaction.editReply({
                content: 'Une erreur s\'est produite lors de la récupération des membres.',
                ephemeral: true,
            });
        }
    }

    addOptionalCommandData() {
        // Not needed
    }
}

export default new MembersListCommand();
