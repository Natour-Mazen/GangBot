import { EmbedBuilder, PermissionsBitField } from 'discord.js';
import BasicCommand from "../basicCommand.js";

class RolesListCommand extends BasicCommand {
    constructor() {
        super('admin_roleslist', 'Affiche la liste des rôles disponibles avec leurs IDs (administrateurs uniquement).');
    }

    async handleCommand(interaction) {
        // Vérification des permissions administrateur
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({
                content: '🚫 Vous devez être administrateur pour utiliser cette commande.',
                ephemeral: true,
            });
        }

        // Récupération des rôles du serveur
        const roles = interaction.guild.roles.cache.map(role => ({
            name: role.name,
            id: role.id,
        }));

        // Diviser les rôles en groupes de 25
        const roleChunks = [];
        while (roles.length > 0) {
            roleChunks.push(roles.splice(0, 25));
        }

        // Créer un embed pour chaque groupe de 25 rôles
        const embeds = roleChunks.map((chunk, index) => {
            const embed = new EmbedBuilder()
                .setColor(0x7289DA)
                .setTitle(`Liste des rôles du serveur - Partie ${index + 1}`)
                .setDescription('Voici les rôles disponibles avec leurs IDs :')
                .setTimestamp();

            chunk.forEach(role => {
                embed.addFields({ name: role.name, value: `ID : ${role.id}`, inline: true });
            });

            return embed;
        });

        // Répondre avec tous les embeds
        await interaction.reply({ embeds, ephemeral: true });
    }

    addOptionalCommandData() {
        // Not needed
    }
}

export default new RolesListCommand();
