import RappelMessageEvent from "../rappelMessageEvent.js";
import MyRecurrenceRule from "../../../myRecurrenceRule.js";


export default class AlternantsRappelEvent extends RappelMessageEvent {
    constructor(client) {
        const channelId = "1315307101723033645"; // ID du salon #général-étude-m2
        const lesAlternantsRole = "<@&1315307100485980224>";
        const message = `Bonjour ${lesAlternantsRole}, on est à la fin du mois, n'oubliez pas de remplir votre fiche de présence et l'envoyer à Sylvie, sinon Hakim va pas être content !`;
        const recurrenceRule = [];
        recurrenceRule.push(AlternantsRappelEvent.calculateRecurrenceRule());
        recurrenceRule.push(new MyRecurrenceRule(0, 31, 10, 31, 11, 2024, "*", "*"));
        super(client, "AlternantRappel", recurrenceRule,true, channelId, message);
    }

    static getLastDayOfMonth = (year, month) => {
        return new Date(year, month, 0).getDate(); // Le 0ème jour du mois suivant donne le dernier jour du mois actuel
    };

    static calculateRecurrenceRule() {
        const now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth() + 1; // Passer au mois suivant

        // Gérer le passage à l'année suivante si le mois est décembre
        if (month > 11) {
            month = 0; // Janvier de l'année suivante
            year += 1;
        }
        const lastDay = AlternantsRappelEvent.getLastDayOfMonth(year, month);
        return new MyRecurrenceRule(0, 30, 10, lastDay, month, year, "*", "*");
    }
}
