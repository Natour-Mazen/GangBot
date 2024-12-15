import fs from "fs";
import BasicCommand from "../../basicCommand.js";

class ConvocationCommand extends BasicCommand {
    constructor() {
        super('convocation', 'Convocation d\'un utilisateur avec une certaine gravite');
    }

    async handleCommand(interaction) {
        const user = interaction.options.getUser('user');
        let severity = interaction.options.getInteger('severity');
        if (!severity) {
            severity = 1;
        }
        severity = Math.min(Math.max(severity, 1), 5);

        // Lire le fichier JSON
        const convocationMessages = JSON.parse(fs.readFileSync('src/commandes/fun/convocation/convocationMsgs.json', 'utf8'));

        // Choisir un message de convocation au hasard
        const convocationMessage = convocationMessages[Math.floor(Math.random() * convocationMessages.length)];

        let finalMessage = '';
        for (let i = 0; i < severity; i++) {
            finalMessage += `<@${user.id}> est convoque. ${convocationMessage}\n`;
        }

        await interaction.reply(finalMessage);
    }

    addOptionalCommandData() {
        this.getCommandData().addUserOption(option =>
            option.setName('user')
                .setDescription('L\'utilisateur a convoquer')
                .setRequired(true))
            .addIntegerOption(option =>
                option.setName('severity')
                    .setDescription('La gravite de la convocation de 1 -> 5')
                    .setRequired(false))
    }
}

export default new ConvocationCommand();
