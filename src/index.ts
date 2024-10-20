import { Client, GatewayIntentBits } from "discord.js";

import Redis from "ioredis";
import mongoose from "mongoose";

import { loadCommands, loadEvents } from "./utils/loader";

import CommandManager from "./managers/CommandManager";

import config from "./config";
import ModuleManager from "./managers/ModuleManager";

process.on("uncaughtException", console.error);

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
client.modules = new ModuleManager(client as Client<true>);
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
