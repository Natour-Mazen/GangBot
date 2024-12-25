import rolesListCommand from "../../commandes/admin/rolesListCommand.js";
import membersListCommand from "../../commandes/admin/membersListCommand.js";
import channelsListCommand from "../../commandes/admin/channelsListCommand.js";
import createReminderCommand from "../../commandes/admin/reminderCommands/createReminderCommand.js";
import cancelReminderCommand from "../../commandes/admin/reminderCommands/cancelReminderCommand.js";

class AdminCommandHandler {
    constructor() {
        this.commands = [
            rolesListCommand,
            membersListCommand,
            channelsListCommand,
            createReminderCommand,
            cancelReminderCommand
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
