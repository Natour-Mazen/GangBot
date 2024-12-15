// eventsHandler.js
import AlternantsRappelEvent from "../events/useful/rappelMessageEventTypes/alternantsRappelEvent.js";
import StagiairesRappelEvent from "../events/useful/rappelMessageEventTypes/stagiairesRappelEvent.js";
import EventScheduler from "../scheduleEvents/eventScheduler.js";
import LonelyEvent from "../events/fun/lonely/lonelyEvent.js";


class EventsHandler {
    constructor(client) {
        this.client = client;
        this.events = [
            new AlternantsRappelEvent(client),
            new StagiairesRappelEvent(client),
            new LonelyEvent(client)
        ];
        this.scheduler = new EventScheduler();
    }

    registerEvents() {
        // Planifie tous les événements enregistrés dans l'EventScheduler
        console.log(`Loading ${this.events.length} events...`);
        this.events.forEach(event => this.scheduler.scheduleEvent(event));
        console.log('All events scheduled.');
    }
}

export default EventsHandler;
