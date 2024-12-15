import schedule from 'node-schedule';

export default class EventScheduler {
    constructor() {
        this.scheduledEvents = []; // Liste des événements planifiés
    }

    scheduleEvent(event) {
        const scheduledDates = event.getScheduledDates();
        if (scheduledDates) {
            // Planifie les événements manuellement pour les dates spécifiques
            scheduledDates.forEach(date => {
                const cronTime = `0 ${date.split(' ')[1]} ${date.split(' ')[0]} * * *`; // Format cron simple
                const job = schedule.scheduleJob(cronTime, () => {
                    event.execute();
                });
                // Ajouter à la liste pour tracking
                this.scheduledEvents.push({ event, cronTime, job });
                console.log(`Événement planifié pour ${date} : ${event.name} avec cron ${cronTime}`);
            });
        } else {
            // Planifie l'événement selon le cron habituel
            const cronTime = event.getCronTime();
            const job = schedule.scheduleJob(cronTime, () => {
                event.execute();
            });
            // Ajouter à la liste pour tracking
            this.scheduledEvents.push({ event, cronTime, job });
            console.log(`Événement planifié : ${event.name} avec cron ${cronTime}`);
        }
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
