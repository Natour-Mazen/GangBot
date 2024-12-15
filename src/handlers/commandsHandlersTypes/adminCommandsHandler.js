import rolesListCommand from "../../commandes/admin/rolesListCommand.js";
import membersListCommand from "../../commandes/admin/membersListCommand.js";
import channelsListCommand from "../../commandes/admin/channelsListCommand.js";

class AdminCommandHandler {
    constructor() {
        this.commands = [
            rolesListCommand,
            membersListCommand,
            channelsListCommand
        ];
    }

    handleCommand(command, commandName, interaction) {
        const handler = command.handleCommand;
        if (handler) {
            return handler(interaction);
        }
    }
}

export default AdminCommandHandler;
