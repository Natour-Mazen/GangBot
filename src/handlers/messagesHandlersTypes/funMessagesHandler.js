// src/messageHandlersTypes/funMessageHandler.js
import QuoiMessageResponser from "../../messages/fun/quoiMessageResponser.js";
import ExcuseMessageResponser from "../../messages/fun/ExcuseMessageResponser.js";

class FunMessagesHandler {
    constructor() {
        this.messagesResponsers = [
             QuoiMessageResponser,
             ExcuseMessageResponser
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
