import RappelMessageEvent from "../rappelMessageEvent.js";
import MyRecurrenceRule from "../../../myRecurrenceRule.js";


export default class AlternantsRappelEvent extends RappelMessageEvent {
    constructor(client) {
        const channelId = "1315307101723033645"; // ID du salon #général-étude-m2
        const lesAlternantsRole = "<@&1315307100485980224>";
        const message = `Bonjour ${lesAlternantsRole}, on est à la fin du mois, n'oubliez pas de remplir votre fiche de présence et l'envoyer à Sylvie, sinon Hakim va pas être content !`;
        const recurrenceRule = AlternantsRappelEvent.calculateRecurrenceRule();
        super(client, "AlternantRappel", recurrenceRule,true, channelId, message);
    }

    static getLastDayOfMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate(); // Le 0ème jour du mois suivant donne le dernier jour du mois actuel
    };

    static calculateRecurrenceRule() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth(); // (0 = janvier)
        const lastDay = AlternantsRappelEvent.getLastDayOfMonth(year, month);
        return new MyRecurrenceRule(0, 30, 10, lastDay, "*", "*", "*", "*");
    }
}
