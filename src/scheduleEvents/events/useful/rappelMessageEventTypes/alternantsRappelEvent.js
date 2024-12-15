
import RappelMessageEvent from "../rappelMessageEvent.js";
import MyRecurrenceRule from "../../../myRecurrenceRule.js";


export default class AlternantsRappelEvent extends RappelMessageEvent {
    constructor(client) {
        const channelId = "1315307101723033645"; // ID du salon #général-étude-m2
        const lesAlternantsRole = "<@&1315307100485980224>";
        const message = `Bonjour ${lesAlternantsRole}, on est à la fin du mois, n'oubliez pas de remplir votre fiche de présence et l'envoyer à Sylvie, sinon Hakim va pas être content !`;
        const recurrenceRule = new MyRecurrenceRule(0, 0, 10, 28, "*", "*", "*", "*");
        super(client, "AlternantRappel", recurrenceRule, channelId, message);
    }
}
