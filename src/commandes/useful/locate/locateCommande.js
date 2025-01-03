import BasicCommand from "../../basicCommand.js";
import fs from "fs";

class LocateCommand extends BasicCommand {
    constructor() {
        super('locate', 'Renvoie une réponse spécifique en fonction du choix de l\'utilisateur');
    }

    async handleCommand(interaction) {
        const userChoice = interaction.options.getString('choice');
        const choices = JSON.parse(fs.readFileSync('src/commandes/useful/locate/choices.json', 'utf8'));
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
