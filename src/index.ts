import { Client, GatewayIntentBits } from "discord.js";
import { loadCommands, loadEvents } from "./utils/loader";
import Redis from "ioredis";
import mongoose from "mongoose";

import CommandManager from "./utils/managers/CommandManager";

import config from "./config";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

client.config = config;
client.commands = new CommandManager(client);
client.redis = new Redis(config.redisURI);

client.redis.on("ready", () => console.log("Đã kết nối tới Redis"));
mongoose.connection.on("connected", () =>
    console.log("Đã kết nối tới MongoDB"),
);

await Promise.all([
    loadEvents(client),
    loadCommands(client),
    mongoose.connect(config.mongoURI!, {
        dbName: process.env.NODE_ENV === "development" ? "dev" : "prod",
    }),
]);

await client.login(config.token);
