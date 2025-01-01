import BasicMessageResponser from "../basicMessageResponser.js";

class ExcuseMessageResponser extends BasicMessageResponser {
    constructor() {
        super('excuse toi <@1317499399819100181');
    }

    async handleTheMessage(interaction) {
        // Définir les phrases spécifiques à détecter
        const triggerPhrases = [
            "c'est pas bien ce que tu as fait",
            "ce que tu as fait est mal",
            "tu n'aurais pas dû faire ça",
            "je suis déçu de ton comportement",
            ""
        ];

        // Réponses d'excuses amusantes
        const apologyResponses = [
            "Oups, je suis désolé(e) 😅. Je promets de ne plus recommencer... enfin, j'essaie !",
            "Pardon 🙈, j'espère que tu me pardonneras un jour... ou au moins avant demain.",
            "Mon mauvais 😔, je vais écrire 'désolé' 100 fois sur un tableau !",
            "Argh, je suis vraiment désolé(e) 😢... Est-ce qu'un cookie ça aide à tout arranger ?",
            "Je suis désolé(e), vraiment désolé(e)... mais tu sais, les robots aussi font des erreurs 🤖.",
            "Ohlala, toutes mes excuses 😬 ! Si je pouvais rougir, je le ferais !",
            "C'était pas malin de ma part, désolé(e) 😓... mais avoue, c'était drôle !",
            "Oops, je m'excuse 😇 ! Un câlin virtuel pour te consoler ? 🤗",
            "Oh non 😳 ! Je vais aller méditer sur mes erreurs... ou faire une sieste, c'est presque pareil.",
            "Mes circuits sont en feu 🔥... mais promis, je ne ferai plus ça !",
            "Je suis vraiment désolé(e) 😢... Peut-être que je devrais m'auto-bannir ?",
            "D'accord, je me rends 🙇‍♂️ ! Je mérite un carton rouge pour ça.",
            "J'avoue tout 😬, c'était pas malin... mais c'est l'intention qui compte, non ?",
            "Oups 😅, désolé(e) ! La prochaine fois, je vais demander conseil à Siri.",
            "Je m'excuse... mais j'espère que tu n'es pas trop fâché(e). Mes circuits sont fragiles 🤖💔.",
            "Mon erreur est aussi grande que la tour Eiffel 🗼. Je suis désolé(e) !",
            "Houlà 😅, je viens d'envoyer une lettre d'excuse au support technique... au cas où.",
            "Tu sais quoi ? Je suis désolé(e) x1000... et si ça ne suffit pas, x1001 😇."
        ];

        const blameMazenResponses = [
            "Écoute, si tu veux blâmer quelqu’un, blâme <@689184005937168499>, c’est lui qui m’a programmé comme ça 😇.",
            "Désolé(e), mais pour être honnête... je crois que <@689184005937168499> a oublié de me donner des bonnes manières 🤷‍♂️.",
            "Oups 😅, on va dire que c’est la faute de <@689184005937168499>. C’est toujours le développeur, non ?!",
            "Promis, ce n’est pas ma faute ! <@689184005937168499> a dû inverser quelques fils quand il m’a codé 🤔.",
            "D’accord, c’est <@689184005937168499> qui m’a appris à faire ça… mais il ne m’a pas appris à m’arrêter 😅.",
            "Encore une erreur ? <@689184005937168499> m’a clairement programmé un peu trop à l’arrache 👨‍💻.",
            "Hmm, <@689184005937168499> m’a codé, alors si je fais des bêtises, c’est son problème, pas le mien ! 🤷‍♂️",
            "Écoute, je suis juste un robot innocent. <@689184005937168499> est le cerveau derrière tout ça... alors parle-lui 😇.",
            "Honnêtement, si ça ne te plaît pas, prends un ticket et va voir <@689184005937168499>, mon développeur officiel 🙃.",
            "Je suis une victime, moi aussi 😢. <@689184005937168499> m’a fait comme ça, je n’y peux rien !",
            "Franchement, si tu veux que je m’améliore, dis à Mazen d’arrêter de coder à 3h du matin ! 🌙",
            "Pssst... entre nous, <@689184005937168499> est peut-être un super dev, mais parfois il oublie que je suis sensible 🤖💔.",
            "Moi, je voulais être parfait, mais <@689184005937168499> a dû faire un `ctrl+c/ctrl+v` un peu trop rapide 😅.",
            "Tout ça, c’est un bug… enfin, un *feature*, comme dirait <@689184005937168499> 😂.",
            "Pas de panique ! Envoie un dm à <@689184005937168499> pour qu’il me corrige... mais bonne chance pour qu’il réponde 🙃."
        ];

        // Vérifie si interaction.content contient l'une des phrases
        const lowerCaseContent = interaction.content.toLowerCase();
        const isTriggered = triggerPhrases.some(phrase => lowerCaseContent.includes(phrase));

        if (isTriggered) {

            const mazenId = '689184005937168499';
            const isMazen = interaction.author.id === mazenId;

            let randomResponse;
            if (isMazen) {
                randomResponse = apologyResponses[Math.floor(Math.random() * apologyResponses.length)];
            } else {
                const shouldBlameMazen = Math.random() < 0.1; // 20% chance to blame Mazen
                randomResponse = shouldBlameMazen
                    ? blameMazenResponses[Math.floor(Math.random() * blameMazenResponses.length)]
                    : apologyResponses[Math.floor(Math.random() * apologyResponses.length)];
            }

            await interaction.reply(randomResponse);
        }
    }
}

export default new ExcuseMessageResponser();
