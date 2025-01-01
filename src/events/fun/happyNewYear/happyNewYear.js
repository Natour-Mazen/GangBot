import BaseEvent from '../../baseEvent.js';
import MyRecurrenceRule from "../../../scheduleEvents/myRecurrenceRule.js";
import fs from "fs";

export default class HappyNewYearEvent extends BaseEvent {
    constructor(client) {
        const newYearRecurrenceRule = HappyNewYearEvent.defineRecurrenceRule();
        super(client, "HappyNewYearEvent", newYearRecurrenceRule, false);
        this.channelId = "1315307101093892159";
    }

    static defineRecurrenceRule() {
        const nowDate = new Date();
        const isNewYear = nowDate.getDate() === 1 && nowDate.getMonth() === 0 && nowDate.getHours() === 0;
        if (isNewYear) {
            return new MyRecurrenceRule(0, 0, 0, 1, 0, nowDate.getFullYear(), "*");
        }
        // Calculer pour le prochain Nouvel An
        const nextYear = nowDate.getFullYear() + 1;
        return new MyRecurrenceRule(0, 0, 0, 1, 0, nextYear, "*");
    }


    async execute() {
        console.log('HappyNewYearEvent execute()');
        try {
            const channel = await this.client.channels.fetch(this.channelId);
            if (channel && channel.isTextBased()) {
                // Lire les liens des GIFs depuis le fichier JSON
                const gifs = JSON.parse(fs.readFileSync('src/events/fun/happyNewYear/newYearGifs.json', 'utf8'));

                // Envoyer un message mentionnant tout le monde
                await channel.send(`@everyone Bonne année à tous ! 🎉🎆 Que cette nouvelle année vous apporte bonheur, santé et réussite !`);

                // Envoyer 5 GIFs de Nouvel An
                for (let i = 0; i < gifs.length; i++) {
                    const randomGif = gifs[i];
                    await channel.send(randomGif);
                }
                // console.log(`Messages et GIFs de Nouvel An envoyés dans le salon ${this.channelId}.`);
            } else {
                console.error(`Le salon ${this.channelId} n'est pas textuel ou introuvable.`);
            }
        } catch (error) {
            console.error(`Erreur lors de l'exécution de ${this.name} pour le salon ${this.channelId}:`, error);
        }
    }
}
