import choices from './choices.json';
import BasicCommand from "../../basicCommand.js";

class LocateCommand extends BasicCommand {
    constructor() {
        super('locate', 'Renvoie une réponse spécifique en fonction du choix de l\'utilisateur');
    }

    async handleCommand(interaction) {
        const userChoice = interaction.options.getString('choice');
        let response = choices[userChoice] || 'Choix non reconnu 🥲';
        await interaction.reply(response);
    }

    addOptionalCommandData() {
        this.getCommandData().addStringOption(option =>
            option.setName('choice')
                .setDescription('Choix de l\'utilisateur')
                .setRequired(true)
                .addChoices(...Object.keys(choices).map(key => ({ name: key, value: key })))
        );
    }
}

export default new LocateCommand();
