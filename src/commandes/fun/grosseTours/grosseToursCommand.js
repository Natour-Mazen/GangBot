import { AttachmentBuilder } from 'discord.js';
import fs from 'fs';
import BasicCommand from "../../basicCommand.js";

class GrosseToursCommand extends BasicCommand {
    constructor() {
        super('mmmhgrossetours', 'est ce que t\'as déjà mangé les 2 tours d\'un mec');
    }

    async handleCommand(interaction) {
        const target1 = interaction.options.getUser('target1');
        const target2 = interaction.options.getUser('target2');

        // Check if either target is a bot
        if (target1.bot || target2.bot) {
            return await interaction.reply({
                content: 'Oh là là ! On dirait que tu as essayé de cibler un bot. 🤖 Les bots sont trop occupés à... botter pour participer à cette blague. 😂 Veuillez sélectionner deux membres humains. 👥',
                ephemeral: true
            });
        }
        const imageFile = 'src/commandes/fun/grosseTours/MamaTours.png';
        const attachment = new AttachmentBuilder(fs.createReadStream(imageFile));

        await interaction.reply({
            content: `${target1} ne peut pas résister à la grosse tours de ${target2} ! 🗼😏 Qui pourrait lui en vouloir ? 😈`,
            files : [attachment]
        });
    }

    addOptionalCommandData() {
        this.getCommandData().addUserOption(option =>
                option.setName('target1')
                    .setDescription('Le mangeur')
                    .setRequired(true))
                .addUserOption(option =>
                    option.setName('target2')
                        .setDescription('le mangé')
                        .setRequired(true))
    }
}

export default new GrosseToursCommand();
