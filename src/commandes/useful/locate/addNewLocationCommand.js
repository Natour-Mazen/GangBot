import fs from "fs";
import BasicCommand from "../../basicCommand.js";

class AddNewLocationCommand extends BasicCommand {
    constructor() {
        super('addnewlocation', 'Ajoute un nouveau lien d\'un message dans la commande locate');
    }

    async handleCommand(interaction) {
        const name = interaction.options.getString('name');
        const link = interaction.options.getString('link');

        // Vérifiez si le lien commence par 'https://discord.com/'
        if (!link.startsWith('https://discord.com/channels/')) {
            await interaction.reply({ content: "Erreur : Ce lien est aussi cassé qu'un miroir après 7 ans de malchance ! 😱 Assure-toi qu'il est bon petit malin 😉", ephemeral: true });
            return;
        }

        // Lire le fichier JSON
        const locations = JSON.parse(fs.readFileSync('src/commandes/useful/locate/choices.json', 'utf8'));

        // Ajouter la nouvelle localisation
        locations[name] = ` 😁 ${name} se trouve ici : ${link}`;

        // Écrire le fichier JSON
        fs.writeFileSync('src/commandes/useful/locate/choices.json', JSON.stringify(locations, null, 2));

        await interaction.reply({ content:`La localisation du fichier "${name}" a été ajoutée avec succès ! C'est comme si tu venais de trouver un trésor caché dans un vieux grenier, Merci pour ta contribution cher pirate 🏴‍☠️`,ephemeral: true });
    }

    addOptionalCommandData() {
        this.getCommandData().addStringOption(option =>
            option.setName('name')
                .setDescription('Le nom de l\'element a ajouter')
                .setRequired(true))
            .addStringOption(option =>
                option.setName('link')
                    .setDescription('Le lien ou se trouve l\'element a ajouter')
                    .setRequired(true))
    }
}

export default new AddNewLocationCommand();
