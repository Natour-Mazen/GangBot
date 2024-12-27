import RappelMessageEvent from "../rappelMessageEvent.js";
import MyRecurrenceRule from "../../../scheduleEvents/myRecurrenceRule.js";

export default class StagiairesRappelEvent extends RappelMessageEvent {
     constructor(client) {
         const channelId = "1315307101723033645"; // ID du salon #général-étude-m2
         const lesStagiairesRole = "<@&1315307100485980223>";
         const message = `Bonjour ${lesStagiairesRole}, préparez-vous ! La réunion de fin de sprint avec Hakim approche et il risque de ne pas être content ! Mettez du lubrifiant, vous en aurez besoin 😅`;
         const recurrenceRules = StagiairesRappelEvent.defineRecurrenceRule();
         super(client, "StagiairesRappel", recurrenceRules, false, channelId, message);
     }

     static defineRecurrenceRule() {
         const recurrenceRules = [];
        // recurrenceRules.push(new MyRecurrenceRule(0, 0, 9, 27, 11, 2024, "*", "*"));
         recurrenceRules.push(new MyRecurrenceRule(0, 0, 9, 3, 0, 2025, "*", "*"));
         recurrenceRules.push(new MyRecurrenceRule(0, 0, 9, 10, 0, 2025, "*", "*"));
         recurrenceRules.push(new MyRecurrenceRule(0, 0, 9, 31, 0, 2025, "*", "*"));
         recurrenceRules.push(new MyRecurrenceRule(0, 0, 9, 28, 1, 2025, "*", "*"));
         recurrenceRules.push(new MyRecurrenceRule(0, 0, 9, 7, 2, 2025, "*", "*"));
         recurrenceRules.push(new MyRecurrenceRule(0, 0, 9, 14, 2, 2025, "*", "*"));
         return recurrenceRules;
     }
}


