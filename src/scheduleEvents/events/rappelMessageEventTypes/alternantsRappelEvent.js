
import RappelMessageEvent from "../rappelMessageEvent.js";

export default class AlternantsRappelEvent extends RappelMessageEvent {
    constructor(client) {
        const channelId = "1315307101723033645"; // ID du salon #général-étude-m2
        const lesAlternantsRole = "<@&1315307100485980224>";
        const message = `Bonjour ${lesAlternantsRole}, on est à la fin du mois, n'oubliez pas de remplir votre fiche de présence et l'envoyer à Sylvie, sinon Hakim va pas être content !`;
        super(client, "AlternantRappel", "0 0 9 28 *", null, channelId, message);
    }
}
