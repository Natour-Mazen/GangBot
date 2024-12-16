import BaseEvent from '../../baseEvent.js';

export default class RappelMessageEvent extends BaseEvent {
    constructor(client, name, recurrenceRule, recalculatedEvent, channelId, message) {
        super(client, name, recurrenceRule, recalculatedEvent);
        this.channelId = channelId;
        this.message = message;
    }

    async execute() {
        try {
            const channel = await this.client.channels.fetch(this.channelId);
            if (channel && channel.isTextBased()) {
                await channel.send(this.message);
                console.log(`Message envoyé dans le salon ${this.channelId} : ${this.message}`);
            } else {
                console.error(`Le salon ${this.channelId} n'est pas textuel ou introuvable.`);
            }
        } catch (error) {
            console.error(`Erreur lors de l'exécution de ${this.name} pour le salon ${this.channelId}:`, error);
        }
    }
}


