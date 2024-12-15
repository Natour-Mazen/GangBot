import BasicCommand from "../basicCommand.js";

class QuoiCommand extends BasicCommand {
    constructor() {
        super('quoi', 'Répond avec fierté :)');
    }

    async handleCommand(interaction) {
        const responses = ['Coube 😈', 'Feur 😈']; // Réponses possibles
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]; // Choisir aléatoirement une réponse
        await interaction.reply(randomResponse); // Répondre avec la réponse choisie
    }

    addOptionalCommandData() {
        // Not needed
    }
}

export default new QuoiCommand();
