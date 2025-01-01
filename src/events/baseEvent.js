import {v4} from 'uuid';

export default class BaseEvent {

    /**
     * Create a new BaseEvent
     * @param {import('discord.js').Client} client - Discord client
     * @param {string} name - Name of the event (useful for logs)
     * @param {MyRecurrenceRule} recurrenceRule - Recurrence rule for scheduling
     * @param {boolean} recalculatedEvent - If the event is recalculated or not
     */
    constructor(client, name, recurrenceRule, recalculatedEvent = false) {
        if (new.target === BaseEvent) {
            throw new Error("BaseEvent is an abstract class and cannot be instantiated directly.");
        }
        this.client = client;
        this.name = name; // Nom de l'événement (utile pour les logs)
        this.uuid = v4(); // generate a random uuid for the event
        this.recurrenceRule = recurrenceRule; // Chaîne de temps cron pour la planification
        this.recalculatedEvent = recalculatedEvent; // Si l'événement doit être recalculé ou non
    }

    execute() {
        throw new Error(`Execute method must be implemented in ${this.name}`);
    }

    getRecurrenceRule() {
        return this.recurrenceRule;
    }

    isRecalculatedEvent() {
        return this.recalculatedEvent;
    }

    getUUID() {
        return this.uuid;
    }

    setUUID(uuid) {
        this.uuid = uuid;
    }

    getName() {
        return this.name;
    }

    getClient() {
        return this.client;
    }
}
