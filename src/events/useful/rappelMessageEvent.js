import BaseEvent from '../baseEvent.js';
import {AttachmentBuilder} from "discord.js";

export default class RappelMessageEvent extends BaseEvent {
    constructor(client, name, recurrenceRule, recalculatedEvent, channelId, message, attachmentPath= null) {
        super(client, name, recurrenceRule, recalculatedEvent);
        this.channelId = channelId;
        this.message = message;
        this.attachmentPath = attachmentPath;
    }

    async execute() {
        try {
            const channel = await this.client.channels.fetch(this.channelId);
            if (channel && channel.isTextBased()) {
                let messagePayload = { content: this.message };

                if (this.attachmentPath) {
                    const attachment = new AttachmentBuilder(this.attachmentPath);
                    messagePayload.files = [attachment];
                }

                await channel.send(messagePayload);
                console.log(`Message envoyé dans le salon ${this.channelId} : ${this.message}`);
            } else {
                console.error(`Le salon ${this.channelId} n'est pas textuel ou introuvable.`);
            }
        } catch (error) {
            console.error(`Erreur lors de l'exécution de ${this.name} pour le salon ${this.channelId}:`, error);
        }
    }
}


