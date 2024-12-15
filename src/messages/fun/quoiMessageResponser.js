import BasicMessageResponser from "../basicMessageResponser.js";

class QuoiMessageResponser extends BasicMessageResponser {
    constructor() {
        super(['quoi', 'koi']);
    }


    async handleTheMessage(interaction) {
        const responses = ['Coube 😈', 'Feur 😈']; // Réponses possibles
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]; // Choisir aléatoirement une réponse
        await interaction.reply(randomResponse); // Répondre avec la réponse choisie
    }
}

export default new QuoiMessageResponser();