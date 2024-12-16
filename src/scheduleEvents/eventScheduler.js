import schedule from 'node-schedule';

export default class EventScheduler {
    constructor() {
        this.scheduledEvents = []; // Liste des événements planifiés
    }

    scheduleEvent(event) {
        const recurrenceRule = event.getRecurrenceRule();
        // push the event name and the id to the scheduledEvents array
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
            if (event.isRecalculatedEvent()) {
                 this.cancelEvent(event.getUUID());
                 event = new event.constructor(event.getClient());
                 this.scheduleEvent(event);
                 //console.log(`Recalcul de l'événement ${event.name}`);
            }
        });
        this.scheduledEvents.push({eventName: event.getName(), eventID: event.getUUID(), job: job});
        console.log(`Prochaine exécution de ${event.name} avec ID ${event.getUUID()} : ${job.nextInvocation().toString()}`);
    }

    cancelEvent(eventID) {
        const eventIndex = this.scheduledEvents.findIndex(e => e.eventID === eventID);
        // console log each element of scheduledEvents
        // this.scheduledEvents.forEach(e => console.log(e));
        // console.log(`Index de l'événement ${eventID} : ${eventIndex}`);
        if (eventIndex >= 0) {
            this.scheduledEvents[eventIndex].job.cancel();
            //console.log(`Événement annulé : ${eventID}`);
            this.scheduledEvents.splice(eventIndex, 1);
        } else {
            console.error(`Aucun événement trouvé avec le nom : ${eventID}`);
        }
    }
}
