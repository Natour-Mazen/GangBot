// eventsHandler.js
import AlternantsRappelEvent from "../events/useful/rappelMessageEventTypes/alternantsRappelEvent.js";
import EventScheduler from "../scheduleEvents/eventScheduler.js";
import LonelyEvent from "../events/fun/lonely/lonelyEvent.js";
import {readEventsFromJson} from "../commandes/admin/reminderCommands/utils/readEventsFromJson.js";
import StagiairesRappelEvent from "../events/useful/rappelMessageEventTypes/StagiairesRappelEvent.js";
import HappyNewYearEvent from "../events/fun/happyNewYear/happyNewYear.js";


class EventsHandler {
    constructor(client) {
        this.client = client;
        this.initialEvents = [
            new AlternantsRappelEvent(client),
            new StagiairesRappelEvent(client),
            new HappyNewYearEvent(client),
            new LonelyEvent(client),
        ];
        this.events = [...this.initialEvents];
        this.scheduler = new EventScheduler();
    }

    async registerEvents() {
        await new Promise(resolve => setTimeout(resolve, 5000));

        // load events from JSON file and add them to the events list and schedule them
        const filePath = 'src/commandes/admin/reminderCommands/ephemeralEvents.json';
        const events = await readEventsFromJson(filePath, this.client);

        this.events = [...this.initialEvents, ...events.filter(event => !this.initialEvents.some(e => e.getUUID() === event.getUUID()))];

        // Planifie tous les événements enregistrés dans l'EventScheduler
        console.log(`Loading ${this.events.length} events...`);
        this.events.forEach(event => this.scheduler.scheduleEvent(event));
        console.log('All events scheduled.');
    }

    getScheduledEvents() {
        return this.scheduler.scheduledEvents;
    }

    cancelEvent(eventID) {
        this.scheduler.cancelEvent(eventID);
    }

    addEvent(event) {
        this.events.push(event);
    }
}

export default EventsHandler;
