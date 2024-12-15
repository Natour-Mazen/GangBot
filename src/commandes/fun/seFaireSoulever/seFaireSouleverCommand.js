import { AttachmentBuilder } from 'discord.js';
import fs from 'fs';
import BasicCommand from "../../basicCommand.js";

class SeFaireSouleverCommand extends BasicCommand {
    constructor() {
        super('y_a_agnes', 'Agnes arrive avec un soulevé de terre ! Accrochez-vous à vos haltères ! 💪😂');
    }

    async handleCommand(interaction) {
        const audioFile = 'src/commandes/fun/seFaireSoulever/Aie_ça_fait_mal.m4a';
        const attachment = new AttachmentBuilder(fs.createReadStream(audioFile));
        await interaction.reply({ files: [attachment] });
    }

    addOptionalCommandData() {
        // Not needed
    }
}

export default new SeFaireSouleverCommand();
