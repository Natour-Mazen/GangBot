// eventHandler.js
import AlternantsRappelEvent from "../scheduleEvents/events/rappelMessageEventTypes/alternantsRappelEvent.js";
import StagiairesRappelEvent from "../scheduleEvents/events/rappelMessageEventTypes/stagiairesRappelEvent.js";
import EventScheduler from "../scheduleEvents/eventScheduler.js";


class EventHandler {
    constructor(client) {
        this.client = client;
        this.events = [
            new AlternantsRappelEvent(client),
            new StagiairesRappelEvent(client)
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

export default EventHandler;
