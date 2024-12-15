import AdminMessagesHandler from "./messagesHandlersTypes/adminMessagesHandler.js";
import UsefulMessagesHandler from "./messagesHandlersTypes/usefulMessagesHandler.js";
import FunMessagesHandler from "./messagesHandlersTypes/funMessagesHandler.js";


class MessageHandler {

    constructor() {
        this.adminHandler = new AdminMessagesHandler();
        this.usefulHandler = new UsefulMessagesHandler();
        this.funHandler = new FunMessagesHandler();
    }

    handleMessage = async (message) => {
        if (message.author.bot) return; // Ignorer les messages des bots

        for (const handler of  [this.funHandler, this.usefulHandler, this.adminHandler]) {
            for (let messagesResponser of handler.messagesResponsers) {
                if (messagesResponser.getKeywords().some(keyword => message.content.includes(keyword))) {
                    await handler.handleMessage(messagesResponser, message);
                }
            }
        }
    }
}

export default MessageHandler;
