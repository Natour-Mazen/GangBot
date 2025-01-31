import RappelMessageEvent from "../rappelMessageEvent.js";
import MyRecurrenceRule from "../../../scheduleEvents/myRecurrenceRule.js";


export default class AlternantsRappelEvent extends RappelMessageEvent {
    constructor(client) {
        const channelId = "1315307101723033645"; // ID du salon #général-étude-m2
        const lesAlternantsRole = "<@&1315307100485980224>";
        const message = `Bonjour ${lesAlternantsRole}, on est à la fin du mois, n'oubliez pas de remplir votre fiche de présence et l'envoyer à Sylvie, sinon Hakim va pas être content !`;
        const recurrenceRule = AlternantsRappelEvent.calculateRecurrenceRule();
        super(client, "AlternantRappel", recurrenceRule,true, channelId, message);
    }

    static getLastDayOfMonth = (year, month) => {
        return new Date(year, month, 0).getDate(); // Le 0ème jour du mois suivant donne le dernier jour du mois actuel
    };

    static calculateRecurrenceRule() {
        const now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth(); // Mois actuel (indexé à partir de 0)
        let lastDay = AlternantsRappelEvent.getLastDayOfMonth(year, month);
        const startHour = 9;

        // si on est passé après 10h00 et qu'on est le dernier jour du mois
        if (now.getHours() >= startHour && now.getDate() === lastDay) {
            month += 1; // Passer au mois suivant
            // passage à l'année suivante si le mois dépasse décembre
            if (month > 11) {
                month = 0; // Janvier de l'année suivante
                year += 1;
            }
            lastDay = AlternantsRappelEvent.getLastDayOfMonth(year, month + 1);
        }

        return new MyRecurrenceRule(
            0,
            0,
            startHour,
            lastDay,
            month,
            year,
            "*"
        );
    }

}
