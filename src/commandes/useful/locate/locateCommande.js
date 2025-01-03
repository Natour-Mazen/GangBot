import BasicCommand from "../../basicCommand.js";
import fs from "fs";

class LocateCommand extends BasicCommand {
    constructor() {
        super('locate', 'Renvoie une réponse spécifique en fonction du choix de l\'utilisateur');
        const choicesFilePath = 'src/commandes/useful/locate/choices.json';
        this.choices = fs.existsSync(choicesFilePath) ? JSON.parse(fs.readFileSync(choicesFilePath, 'utf8')) : {};
    }

    async handleCommand(interaction) {
        const userChoice = interaction.options.getString('choice');
        let response = this.choices[userChoice] || 'Choix non reconnu 🥲';
        await interaction.reply(response);
    }

    addOptionalCommandData() {
        const choicesFilePath = 'src/commandes/useful/locate/choices.json';
        const choices = fs.existsSync(choicesFilePath) ? JSON.parse(fs.readFileSync(choicesFilePath, 'utf8')) : {};
        this.getCommandData().addStringOption(option =>
            option.setName('choice')
                .setDescription('Choix de l\'utilisateur')
                .setRequired(true)
                .addChoices(...Object.keys(choices).map(key => ({ name: key, value: key })))
        );
    }
}

export default new LocateCommand();
