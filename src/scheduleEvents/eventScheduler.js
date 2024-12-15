import schedule from 'node-schedule';

export default class EventScheduler {
    constructor() {
        this.scheduledEvents = []; // Liste des événements planifiés
    }

    scheduleEvent(event) {
        const recurrenceRule = event.getRecurrenceRule();
        if (Array.isArray(recurrenceRule)) {
            recurrenceRule.forEach(rule => {
                this.#scheduleJob(event, rule);
            });
        } else {
            this.#scheduleJob(event, recurrenceRule);
        }
    }

    #scheduleJob(event, rule) {
        const job = schedule.scheduleJob(rule.getRule(), () => {
            event.execute();
        });
        console.log(`Prochaine exécution de ${event.name} : ${job.nextInvocation().toString()}`);
    }

    cancelEvent(eventName) {
        const eventIndex = this.scheduledEvents.findIndex(e => e.event.name === eventName);
        if (eventIndex >= 0) {
            this.scheduledEvents[eventIndex].job.cancel();
            console.log(`Événement annulé : ${eventName}`);
            this.scheduledEvents.splice(eventIndex, 1);
        } else {
            console.error(`Aucun événement trouvé avec le nom : ${eventName}`);
        }
    }
}
