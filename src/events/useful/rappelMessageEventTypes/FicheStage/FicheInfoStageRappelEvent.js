import MyRecurrenceRule from "../../../../scheduleEvents/myRecurrenceRule.js";
import RappelMessageEvent from "../../rappelMessageEvent.js";
import {AttachmentBuilder} from "discord.js";

export default class FicheInfoStageRappelEvent extends RappelMessageEvent {
    constructor(client) {
        const channelId = "1315307101723033645"; // ID du salon #général-étude-m2
        const lesAlternantsRole = "<@&1315307100485980224>";
        const lesStagiairesRole = "<@&1315307100485980223>";

        const message = `🚨 **IMPORTANT - Informations de Stage** 🚨  

        Bonjour ${lesAlternantsRole} et ${lesStagiairesRole},  
        
        Vous devez absolument remplir le **PDF des informations de stage** avant le **30 avril**.  
        
        📌 **Instructions :**  
        1️⃣ Remplissez **attentivement** le document. **Lisez bien avant de signer !**  
        2️⃣ **Votre tuteur en entreprise doit également signer le document.**  
        3️⃣ **Seule la dernière page signée** doit être envoyée à **Sylvie Duclaud** à l’adresse 📧 **sylvie.duclaud@univ-poitiers.fr**.  
        4️⃣ Respectez la **date limite du 30 avril** pour éviter tout problème.  
        
        📂 **Vous trouverez le document en pièce jointe.**  
        
        ⚠️ **Attention** : Si vous ne l’envoyez pas, vous **ne pourrez pas obtenir votre diplôme**.  
        
        Ne prenez pas de risque, faites-le **au plus vite** ! ⏳`;

        const filePath = "src/events/useful/rappelMessageEventTypes/FicheStage/StageInformations2025.pdf"; // Chemin du fichier PDF

        const recurrenceRule = FicheInfoStageRappelEvent.defineNextRecurrenceRule();
        super(client, "FicheInfoStageRappelEvent", MyRecurrenceRule.everyXMinutes(15), true, channelId, message, filePath);
    }

    static defineNextRecurrenceRule() {
        const now = new Date();
        const START_HOUR = 10; // Heure de début de la réunion

        // Liste des dates pré-définies
        const predefinedDates = [
            { day: 28, month: 3, year: 2025 }, // 28 avril 2025
            { day: 30, month: 3, year: 2025 }, // 30 avril 2025
        ];

        // Trouve la prochaine date après la date actuelle
        const nextDate = predefinedDates.find((date) => {
            const eventDate = new Date(date.year, date.month, date.day, START_HOUR, 0, 0); // Date à 10h00
            return now < eventDate; // Comparer si la date actuelle est avant cette date
        });

        if (!nextDate) {
            throw new Error("Aucune date future trouvée dans les dates pré-définies.");
        }

        return new MyRecurrenceRule(
            0, // Secondes
            0, // Minutes
            START_HOUR, // Heures
            nextDate.day, // Jour du mois
            nextDate.month, // Mois (indexé à partir de 0)
            nextDate.year, // Année
            "*" // Jour de la semaine
        );
    }
}

