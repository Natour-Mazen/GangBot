import LocateCommand from "../../commandes/useful/locate/locateCommande.js";
import AddNewLocationCommand from "../../commandes/useful/locate/addNewLocationCommand.js";
import AnnounceCommand from "../../commandes/useful/announce/announceCommand.js";
import PresentationCommand from "../../commandes/useful/presentationCommand.js";

class UsefulCommandHandler {
    constructor() {
        this.commands = [
            LocateCommand,
            AddNewLocationCommand,
            AnnounceCommand,
            PresentationCommand
        ];
    }

    handleCommand(commandName, interaction) {
        const handler = this.commands.find(cmd => cmd.commandData.name === commandName).handleCommand;
        if (handler) {
            return handler(interaction);
        }
    }
}

export default UsefulCommandHandler;
