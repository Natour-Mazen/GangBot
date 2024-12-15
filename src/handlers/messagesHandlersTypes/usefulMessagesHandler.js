// src/messageHandlersTypes/usefulMessageHandler.js

class UsefulMessageHandler {
    constructor() {
        this.messagesResponsers = [

        ];
    }

    async handleMessage(messagesResponser, message) {
        const handler = messagesResponser.handleTheMessage;
        if (handler) {
            return await handler(message);
        }
    }
}

export default UsefulMessageHandler;
