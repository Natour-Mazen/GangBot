import schedule from 'node-schedule';
import eventsHandler from "../../index.js";

export default class EventScheduler {
    constructor() {
        this.scheduledEvents = []; // Liste des événements planifiés
    }

    scheduleEvent(event) {
        const recurrenceRule = event.getRecurrenceRule();
        // push the event name and the id to the scheduledEvents array
        if (Array.isArray(recurrenceRule)) {
            throw new Error("Les règles de récurrence multiples ne sont pas encore prises en charge.");
        } else {
            this.#scheduleJob(event, recurrenceRule);
        }
    }

    #scheduleJob(event, rule) {
        const tempJob = schedule.scheduleJob(rule.getRule(), () => {});
        //console.log(`Planification de l'événement ${event.getName()} avec ID ${event.getUUID()} : ${rule.toString()}`);
        if (!tempJob) {
            console.log(`Invalid rule for event ${event.getName()}. The event will not be scheduled.`);
            return;
        }
        const nextInvocation = tempJob.nextInvocation();
        tempJob.cancel();
        const now = new Date();

        if (nextInvocation <= now) {
            console.log(`The rule for event ${event.getName()} has already passed. The event will not be scheduled.`);
            return;
        }
        const job = schedule.scheduleJob(rule.getRule(), async () => {
            console.log(`Exécution de l'événement ${event.name} avec ID ${event.getUUID()}`);
            event.execute();
            if (event.isRecalculatedEvent()) {
                eventsHandler.cancelEvent(event.getUUID());
                event = new event.constructor(event.getClient());
                eventsHandler.addEvent(event);
                this.scheduleEvent(event);
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
            const event = this.scheduledEvents[eventIndex];
            event.job.cancel();
            console.log(`Événement ${event.eventName} de id ${event.eventID} est bien annulé `);
            this.scheduledEvents.splice(eventIndex, 1);
        } else {
            console.error(`Aucun événement trouvé avec le nom : ${eventID}`);
        }
    }
}
