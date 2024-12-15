import BasicMessageResponser from "../basicMessageResponser.js";

class QuoiMessageResponser extends BasicMessageResponser {
    constructor() {
        super(['quoi', 'koi']);
    }


    async handleTheMessage(interaction) {
        if(this.isRunning) return interaction.deferReply(); // Si déjà en cours, ignorer
        this.isRunning = true; // Mettre en cours
        const responses = ['Coube 😈', 'Feur 😈']; // Réponses possibles
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]; // Choisir aléatoirement une réponse
        await interaction.reply(randomResponse); // Répondre avec la réponse choisie
        this.isRunning = false; // Termine
    }
}

export default new QuoiMessageResponser();