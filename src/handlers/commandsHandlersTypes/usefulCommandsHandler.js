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

    handleCommand(command, commandName, interaction) {
        const handler = command.handleCommand;
        if (handler) {
            return handler(interaction);
        }
    }
}

export default UsefulCommandHandler;
