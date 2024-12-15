import { SlashCommandBuilder } from "@discordjs/builders";

class BasicCommand {
    constructor(name, description) {
        if (new.target === BasicCommand) {
            throw new Error("BasicCommand is an abstract class and cannot be instantiated directly.");
        }

        this.commandData = new SlashCommandBuilder()
        this.commandData.setName(name)
        this.commandData.setDescription(description);

        this.addOptionalCommandData();

        this.commandData.toJSON();

        this.handleCommand = this.handleCommand.bind(this);
    }

    async handleCommand(interaction) {
        throw new Error(`handleCommand method must be implemented in ${this.constructor.name}`);
    }

    addOptionalCommandData() {
        throw new Error(`addOptionalCommandData method must be implemented in ${this.constructor.name}`);
    }

    getCommandData() {
        return this.commandData;
    }
}

export default BasicCommand;
