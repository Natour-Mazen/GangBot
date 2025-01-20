import { ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import BasicCommand from "../../basicCommand.js";

class ConflitCommand extends BasicCommand {
    constructor() {
        super('conflit', 'Lance un sondage pour expulser temporairement un utilisateur (Timeout)');
    }

    async handleCommand(interaction) {

        const user1 = interaction.options.getUser('user1');
        const user2 = interaction.options.getUser('user2');

        // Vérifier que les utilisateurs ne sont pas des bots et sont différents
        if (user1.bot || user2.bot || user1.id === user2.id) {
            return await interaction.reply({
                content: 'Les utilisateurs doivent être différents et ne pas être des bots.',
                ephemeral: true
            });
        }

        await interaction.reply({ content: "⚠️ Vous êtes sur le point de lancer un sondage pour expulser " +
                "temporairement un utilisateur (interdiction de parler). Assurez-vous que cela est justifié !", ephemeral: true });

        // Créer le menu de sélection
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('conflit_poll')
            .setPlaceholder('Choisissez un utilisateur à expulser')
            .addOptions([
                {
                    label: user1.username,
                    description: `Expulser temporairement ${user1.username}`,
                    value: user1.id,
                },
                {
                    label: user2.username,
                    description: `Expulser temporairement ${user2.username}`,
                    value: user2.id,
                },
                {
                    label: 'Personne',
                    description: 'Ne pas expulser quelqu’un',
                    value: 'none',
                },
            ]);

        const row = new ActionRowBuilder().addComponents(selectMenu);

        // Envoyer le sondage
        const pollMessage = await interaction.channel.send({
            content: `Qui devrait être timeout du serveur ?`,
            components: [row],
        });

        // Collecter les réponses
        const filter = i => i.customId === 'conflit_poll' && !i.user.bot;
        const collector = pollMessage.createMessageComponentCollector({ filter, time: 60000 }); // 1 minute

        const votes = {};

        collector.on('collect', async i => {
            const voterId = i.user.id;
            const selected = i.values[0];

            votes[voterId] = selected;

            await i.reply({ content: `Votre vote pour ${selected === 'none' ? 'Personne' : `<@${selected}>`} a été enregistré !`, ephemeral: true });
        });

        collector.on('end', async () => {
            // Compter les votes
            const voteCounts = {};
            Object.values(votes).forEach(vote => {
                voteCounts[vote] = (voteCounts[vote] || 0) + 1;
            });

            const user1Votes = voteCounts[user1.id] || 0;
            const user2Votes = voteCounts[user2.id] || 0;
            const noVotes = voteCounts['none'] || 0;



            // Calculer le tiers du nombre total de membres
            const totalMembers = interaction.guild.memberCount;
            const requiredVotes = Math.ceil(totalMembers / 6);

            let resultMessage;

            if (totalMembers > 0 && noVotes >= requiredVotes) {
                resultMessage = "La tribu a décidé de ne pas expulser quelqu’un cette fois. Peut-être que tout le monde est trop occupé à réfléchir à l'existence de l'univers 🤔" ;
            } else if (user1Votes > user2Votes && user1Votes > noVotes && user1Votes >= requiredVotes) {
                resultMessage = `<@${user1.id}> a été choisi avec ${user1Votes} vote(s), pour être interdit de parler pendant 5 minutes !`;
                await this.timeoutMember(interaction, user1);
            } else if (user2Votes > user1Votes && user2Votes > noVotes && user2Votes >= requiredVotes) {
                resultMessage = `<@${user2.id}> a été choisi avec ${user2Votes} vote(s), pour être interdit de parler pendant 5 minutes !`;
                await this.timeoutMember(interaction, user2);
            } else {
                resultMessage = "La tribu a décidé de ne pas expulser quelqu’un cette fois.";
            }

            await interaction.channel.send(resultMessage);
        });
    }

    async timeoutMember(interaction, user) {
        const member = interaction.guild.members.cache.get(user.id);
        if (member) {
            try {
                await member.timeout(5 * 60 * 1000, "Expulsion temporaire par vote de la tribu");
            } catch (error) {
                console.error("Erreur lors de l'expulsion temporaire :", error);
                await interaction.channel.send("Une erreur est survenue lors de l'expulsion temporaire.");
            }
        } else {
            await interaction.channel.send("Impossible de trouver cet utilisateur sur le serveur.");
        }
    }

    addOptionalCommandData() {
        this.getCommandData().addUserOption(option =>
            option.setName('user1')
                .setDescription('Premier utilisateur')
                .setRequired(true))
            .addUserOption(option =>
                option.setName('user2')
                    .setDescription('Deuxième utilisateur')
                    .setRequired(true))
    }
}

export default new ConflitCommand();
