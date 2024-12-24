import BaseEvent from '../../baseEvent.js';
import MyRecurrenceRule from "../../../scheduleEvents/myRecurrenceRule.js";
import fs from "fs";

export default class LonelyEvent extends BaseEvent {
    constructor(client) {
        const trollRecurrenceRule = MyRecurrenceRule.everyXMinutes(60);
        super(client, "LonelyEvent", trollRecurrenceRule, false);
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
            const onlineMembers = guild.members.cache.filter(member =>
                (member.presence?.status === 'online' || member.presence?.status === 'dnd')
                && !member.user.bot
            );

            let probability = Math.floor(Math.random() * 100);

            if (onlineMembers.size === 1) {
                const lonelyMember = onlineMembers.first();
                if(lonelyMember.presence?.status === 'dnd'){
                    probability = Math.floor(Math.random() * 250);
                }
                if(probability === 0){
                    const channel = await this.client.channels.fetch(this.channelId);
                    if (channel && channel.isTextBased()) {
                        // Lire le fichier JSON
                        const messages = JSON.parse(fs.readFileSync('src/scheduleEvents/events/fun/lonely/lonelyMsgs.json', 'utf8'));
                        const randomPhrase = messages[Math.floor(Math.random() * messages.length)];
                        const message = `Hey ${lonelyMember}, ${randomPhrase}`;
                        await channel.send(message);
                        // console.log(`Message envoyé dans le salon ${this.channelId} : ${message}`);
                    } else {
                        console.error(`Le salon ${this.channelId} n'est pas textuel ou introuvable.`);
                    }
                }
            } else {
                // console.log('Pas de membre seul en ligne ou pas de chance pour le troll.');
            }
        } catch (error) {
            console.error(`Erreur lors de l'exécution de ${this.name} pour le salon ${this.channelId}:`, error);
        }
    }
}
