import fs from 'fs';
import MyRecurrenceRule from "../../../../scheduleEvents/myRecurrenceRule.js";
import RappelMessageEvent from "../../../../events/useful/rappelMessageEvent.js";


async function readEventsFromJson(filePath, client) {
    try {
        // Lire le fichier JSON
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const eventsData = JSON.parse(fileContent);

        // Retourner la liste des événements créés
        return eventsData.map(eventData => {
            // Extraire les valeurs du fichier JSON
            const {id, name, message, isRecalculated, recurrenceRule, channelId} = eventData;

            // Extraire les composants de la règle de récurrence
            const recurrenceParts = parseRecurrenceRule(recurrenceRule);

            // Créer l'objet MyRecurrenceRule
            const {second, minute, hour, day, month, year, dayOfWeek} = recurrenceParts;
            const recurrence = new MyRecurrenceRule(second, minute, hour, day, month, year, dayOfWeek);
            const theEvent = new RappelMessageEvent(
                client,
                name,
                recurrence,
                isRecalculated,
                channelId,
                message
            );

            theEvent.setUUID(id);
            // Créer l'objet RappelMessageEvent
            return theEvent;
        });

    } catch (error) {
        console.error('Erreur lors de la lecture du fichier JSON :', error);
        throw error; // Relancer l'erreur pour que l'appelant puisse la gérer
    }
}

// Fonction pour analyser la chaîne de la règle de récurrence
function parseRecurrenceRule(recurrenceRule) {
    const regex = /second: (\d+|\*), minute: (\d+|\*), hour: (\d+|\*), date: (\d+|\*), month: (\d+|\*), dayOfWeek: (\*|\d+), year: (\d{4}|\*)/;
    const match = recurrenceRule.match(regex);

    if (match) {
        return {
            second: parseInt(match[1], 10),
            minute: parseInt(match[2], 10),
            hour: parseInt(match[3], 10),
            day: parseInt(match[4], 10),
            month: parseInt(match[5], 10),
            dayOfWeek: match[6] === '*' ? '*' : parseInt(match[6], 10),
            year: parseInt(match[7] === '*' ? '*' : parseInt(match[7], 10))
        };
    } else {
        throw new Error(`La règle de récurrence est invalide : ${recurrenceRule}`);
    }
}

export { readEventsFromJson };
