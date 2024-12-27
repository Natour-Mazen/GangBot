// eventsHandler.js
import AlternantsRappelEvent from "../events/useful/rappelMessageEventTypes/alternantsRappelEvent.js";
import EventScheduler from "../scheduleEvents/eventScheduler.js";
import LonelyEvent from "../events/fun/lonely/lonelyEvent.js";
import {readEventsFromJson} from "../commandes/admin/reminderCommands/utils/readEventsFromJson.js";


class EventsHandler {
    constructor(client) {
        this.client = client;
        this.events = [
            new AlternantsRappelEvent(client),
            new LonelyEvent(client)
        ];
        this.scheduler = new EventScheduler();
    }

    async registerEvents() {
        // load events from JSON file and add them to the events list and schedule them
        const filePath = 'src/commandes/admin/reminderCommands/ephemeralEvents.json';
        const events = await readEventsFromJson(filePath, this.client);

        this.events = [...this.events, ...events];

        // Planifie tous les événements enregistrés dans l'EventScheduler
        console.log(`Loading ${this.events.length} events...`);
        this.events.forEach(event => this.scheduler.scheduleEvent(event));
        console.log('All events scheduled.');
    }

    getScheduledEvents() {
        return this.scheduler.scheduledEvents;
    }
}

export default EventsHandler;
