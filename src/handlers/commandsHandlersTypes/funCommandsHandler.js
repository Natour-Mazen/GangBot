import QuoiCouCommand from "../../commandes/fun/quoiCommand.js";
import RouletteCommand from "../../commandes/fun/roulette/rouletteCommand.js";
import ConvocationCommand from "../../commandes/fun/convocation/convocationCommand.js";
import ConflitCommand from "../../commandes/fun/conflit/conflitCommand.js";
import SeFaireSouleverCommand from "../../commandes/fun/seFaireSoulever/seFaireSouleverCommand.js";
import GrosseToursCommand from "../../commandes/fun/grosseTours/grosseToursCommand.js";

class FunCommandHandler {
    constructor() {
        this.commands = [
            QuoiCouCommand,
            RouletteCommand,
            ConvocationCommand,
            ConflitCommand,
            SeFaireSouleverCommand,
            GrosseToursCommand
        ];
    }

    handleCommand(command, commandName, interaction) {
        const handler = command.handleCommand;
        if (handler) {
            return handler(interaction);
        }
    }
}

export default FunCommandHandler;
