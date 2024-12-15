export default class BaseEvent {

    /**
     * Create a new BaseEvent
     * @param {import('discord.js').Client} client - Discord client
     * @param {string} name - Name of the event (useful for logs)
     * @param {MyRecurrenceRule|| MyRecurrenceRule[]} recurrenceRule - Recurrence rule for scheduling
     */
    constructor(client, name, recurrenceRule) {
        if (new.target === BaseEvent) {
            throw new Error("BaseEvent is an abstract class and cannot be instantiated directly.");
        }
        this.client = client;
        this.name = name; // Nom de l'événement (utile pour les logs)
        this.recurrenceRule = recurrenceRule; // Chaîne de temps cron pour la planification
    }

    execute() {
        throw new Error(`Execute method must be implemented in ${this.name}`);
    }

    getRecurrenceRule() {
        return this.recurrenceRule;
    }
}
