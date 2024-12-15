import { SlashCommandBuilder } from '@discordjs/builders';
import fs from "fs";
import BasicCommand from "../../basicCommand.js";

class RouletteCommand extends BasicCommand {
    constructor() {
        super('roulette-russe', 'Sélectionne un utilisateur au hasard 😏');
        this.isRunning = false;
    }

    async handleCommand(interaction) {
        if (this.isRunning) { // Vérifie si la commande est en cours d'exécution
            return await interaction.reply({ content: "La roulette-russe est déjà en cours d'exécution, patience ! 😠 Sinon, tu seras le prochain sur la liste ! 👺", ephemeral: true });
        }
        this.isRunning = true;
        await interaction.reply("La roulette tourne... 🙊");
        let members = await interaction.guild.members.fetch();
        members = members.filter(member => !member.user.bot);
        const memberArray = [...members.values()];
        const randomMember = memberArray[Math.floor(Math.random() * memberArray.length)];

        // Lire le fichier JSON et choisir un défi au hasard
        const challenges = JSON.parse(fs.readFileSync('src/commandes/fun/roulette/challenges.json', 'utf8'));
        const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];

        setTimeout(async () => {
            await interaction.followUp("La roulette a trouvé quelqu'un... 🫠");
            setTimeout(async () => {
                await interaction.followUp(`${randomMember.user.toString()} a été sélectionné 😌`);
                setTimeout(async () => {
                    await interaction.followUp(`Ton défi est : ${randomChallenge} 🥵`);
                    this.isRunning = false;
                }, 2000);
            }, 2000);
        }, 2000);
    }

    addOptionalCommandData() {
        // Not needed
    }
}

export default new RouletteCommand();

