import MyRecurrenceRule from "../../../scheduleEvents/myRecurrenceRule.js";
import RappelMessageEvent from "../rappelMessageEvent.js";

export default class StagiairesRappelEvent extends RappelMessageEvent {
    constructor(client) {
        const channelId = "1315307101723033645"; // ID du salon #général-étude-m2
        const lesStagiairesRole = "<@&1315307100485980223>";
        const message = `Bonjour ${lesStagiairesRole}, préparez-vous ! La réunion de fin de sprint avec Hakim approche et il risque de ne pas être content ! Mettez du lubrifiant, vous en aurez besoin 😅`;
        const recurrenceRule = StagiairesRappelEvent.defineNextRecurrenceRule();
        super(client, "StagiairesRappel", recurrenceRule, true, channelId, message);
    }

    static defineNextRecurrenceRule() {
        const now = new Date();

        // Liste des dates pré-définies
        const predefinedDates = [
            { day: 27, month: 11, year: 2024 }, // 27 décembre 2024
            { day: 3, month: 0, year: 2025 },  // 3 janvier 2025
            { day: 10, month: 0, year: 2025 }, // 10 janvier 2025
            { day: 31, month: 0, year: 2025 }, // 31 janvier 2025
            { day: 28, month: 1, year: 2025 }, // 28 février 2025
            { day: 7, month: 2, year: 2025 },  // 7 mars 2025
            { day: 14, month: 2, year: 2025 }  // 14 mars 2025
        ];

        // Trouve la prochaine date après la date actuelle
        const nextDate = predefinedDates.find((date) => {
            const eventDate = new Date(date.year, date.month, date.day, 10, 0, 0); // Date à 10h00
            return now < eventDate; // Comparer si la date actuelle est avant cette date
        });

        if (!nextDate) {
            throw new Error("Aucune date future trouvée dans les dates pré-définies.");
        }

        return new MyRecurrenceRule(
            0, // Secondes
            0, // Minutes
            9, // Heures
            nextDate.day, // Jour du mois
            nextDate.month, // Mois (indexé à partir de 0)
            nextDate.year, // Année
            "*" // Jour de la semaine
        );
    }
}

