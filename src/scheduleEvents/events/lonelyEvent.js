import BaseEvent from '../baseEvent.js';
import MyRecurrenceRule from "../myRecurrenceRule.js";

export default class LonelyEvent extends BaseEvent {
    constructor(client) {
        const trollRecurrenceRule = MyRecurrenceRule.everyXMinutes(1)
        super(client, "LonelyEvent", trollRecurrenceRule);
        this.channelId = "1317561997847691274";
    }

    async execute() {
        try {
            const guild = this.client.guilds.cache.first(); // Récupère la première guilde (serveur)
            if (!guild) {
                console.error('Aucune guilde trouvée.');
                return;
            }

            // Récupère tous les membres en ligne
            const onlineMembers = guild.members.cache.filter(member => member.presence?.status === 'online');

            if (onlineMembers.size === 1 && Math.floor(Math.random() * 50) === 0) {
                const channel = await this.client.channels.fetch(this.channelId);
                if (channel && channel.isTextBased()) {
                    const lonelyMember = onlineMembers.first();
                    const message = `Hey ${lonelyMember}, tu te sens pas un peu seul(e) en ligne ? 😅`;
                    await channel.send(message);
                    console.log(`Message envoyé dans le salon ${this.channelId} : ${message}`);
                } else {
                    console.error(`Le salon ${this.channelId} n'est pas textuel ou introuvable.`);
                }
            }
        } catch (error) {
            console.error(`Erreur lors de l'exécution de ${this.name} pour le salon ${this.channelId}:`, error);
        }
    }
}
