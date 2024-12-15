export default class BaseEvent {
    constructor(client, name, cronTime, scheduledDates = null) {
        if (new.target === BaseEvent) {
            throw new Error("BaseEvent is an abstract class and cannot be instantiated directly.");
        }
        this.client = client;
        this.name = name; // Nom de l'événement (utile pour les logs)
        this.cronTime = cronTime; // Chaîne de temps cron pour la planification
        this.scheduledDates = scheduledDates; // Dates spécifiques pour planifier l'événement
    }

    execute() {
        throw new Error(`Execute method must be implemented in ${this.name}`);
    }

    getCronTime() {
        return this.cronTime;
    }

    getScheduledDates() {
        return this.scheduledDates;
    }
}
