// src/messageHandlersTypes/funMessageHandler.js
import QuoiMessageResponser from "../../messages/fun/quoiMessageResponser.js";

class FunMessagesHandler {
    constructor() {
        this.messagesResponsers = [
             QuoiMessageResponser,
        ];
    }

    async handleMessage(messagesResponser, message) {
        const handler = messagesResponser.handleTheMessage;
        if (handler) {
            return await handler(message);
        }
    }
}

export default FunMessagesHandler;
