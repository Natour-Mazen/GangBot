import { EmbedBuilder } from 'discord.js';
import BasicCommand from "../basicCommand.js";

class PresentationCommand extends BasicCommand {
    constructor() {
        super('presentation','Je suis qui ? 🤔' , );
    }

    async handleCommand(interaction) {
        // Création de l'embed pour la présentation
        const embed = new EmbedBuilder()
            .setColor(0x0099FF) // Couleur de fond de l'embed (bleu clair)
            .setTitle('📢 Bonjour à tous !') // Titre de l'embed
            .setDescription(`Je suis **${interaction.client.user.username}**, votre assistant Discord 🤖. Mon rôle est de rendre votre expérience sur ce serveur plus agréable et amusante.`)
            .addFields( // Champs de l'embed
                { name: 'Ce que je peux faire pour vous :', value: '- 🧭 Trouver des salons et documents\n- 😄 Mettre en avant vos événements\n- 🎲 Lancer des défis amusants\n- 💬 Aider à organiser des sondages et des votes' },
                { name: 'Besoin d\'aide ?', value: 'N’hésitez pas à me demander de l’aide si vous voulez en savoir plus sur mes fonctionnalités. 🤗', inline: true }
            )
            .setFooter({ text: 'Je suis ici pour vous aider à profiter pleinement de votre temps sur ce serveur 🚀' }) // Pied de l'embed
            .setTimestamp(); // Date et heure d'envoi

        // Envoi de l'embed dans le canal
        await interaction.channel.send({ embeds: [embed] });
    }

    addOptionalCommandData() {
        // Not needed
    }
}

export default new PresentationCommand();
