import RappelMessageEvent from "../rappelMessageEvent.js";

export default class StagiairesRappelEvent extends RappelMessageEvent {
     constructor(client) {
         const channelId = "1315307101723033645"; // ID du salon #général-étude-m2
         const lesStagiairesRole = "<@&1315307100485980223>";
         const message = `Bonjour ${lesStagiairesRole}, préparez-vous ! La réunion de fin de sprint avec Hakim approche et il risque de ne pas être content ! Mettez du lubrifiant, vous en aurez besoin 😅`;
         super(client, "StagiairesRappel", null,
             ["27 12 2024", "04 01 2025", "10 01 2025", "31 01 2025", "28 02 2025", "07 03 2025", "14 03 2025"], channelId, message);
     }
}


