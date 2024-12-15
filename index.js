// main.js
import express from 'express';
import {Client, REST} from 'discord.js';
import {config} from "dotenv";
import CommandHandler from './src/handlers/commandsHandler.js'
import EventsHandler from "./src/handlers/eventsHandler.js";
import MessageHandler from "./src/handlers/messagesHandler.js";
const app = express();
const port = process.env.PORT || 3000;

const GatewayIntentBits = {
    Guilds: 1 << 0,
    GuildMembers: 1 << 1,
    GuildBans: 1 << 2,
    GuildEmojisAndStickers: 1 << 3,
    GuildIntegrations: 1 << 4,
    GuildWebhooks: 1 << 5,
    GuildInvites: 1 << 6,
    GuildVoiceStates: 1 << 7,
    GuildPresences: 1 << 8,
    GuildMessages: 1 << 9,
    GuildMessageReactions: 1 << 10,
    GuildMessageTyping: 1 << 11,
    DirectMessages: 1 << 12,
    DirectMessageReactions: 1 << 13,
    DirectMessageTyping: 1 << 14,
    MessageContent: 1 << 15,
    GuildScheduledEvents: 1 << 16,
    AutoModerationConfiguration: 1 << 20,
    AutoModerationExecution: 1 << 21,
};

config();

const TOKEN =  process.env.DISCORD_BOT_TOKEN_ACCESS;


const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping
    ],
});

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN_ACCESS);

const commandHandler = new CommandHandler(rest);
const eventHandler = new EventsHandler(client);
const messageHandler = new MessageHandler();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    eventHandler.registerEvents();
});

client.on('interactionCreate', commandHandler.handleInteraction);

client.on('messageCreate', messageHandler.handleMessage );

app.get('/', (req, res) => {
    res.send('Bot is running');
});

app.listen(port, async () => {
    console.log(`Server is listening on port ${port}`);

    await commandHandler.registerCommands();
    await client.login(TOKEN);
});

