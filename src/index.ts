import "@std/dotenv/load";

import { Client, GatewayIntentBits } from "npm:discord.js";
import { Redis } from "npm:ioredis";
import mongoose from "npm:mongoose";

import process from "node:process";

import { loadCommands, loadComponents, loadEvents } from "./utils/loader.ts";

import CommandManager from "./managers/CommandManager.ts";
import ModuleManager from "./managers/ModuleManager.ts";
import ComponentManager from "./managers/ComponentManager.ts";

import config from "./config.ts";

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
client.components = new ComponentManager(client as Client<true>);
client.modules = new ModuleManager(client as Client<true>);
client.redis = new Redis(config.redisURI);

client.redis.on("ready", () => console.log("Đã kết nối tới Redis"));
mongoose.connection.on("connected", () =>
    console.log("Đã kết nối tới MongoDB"),
);

await Promise.all([
    loadEvents(client),
    loadCommands(client),
    loadComponents(client),
    mongoose.connect(config.mongoURI!, {
        dbName: process.env.NODE_ENV === "development" ? "dev" : "prod",
    }),
]);

await client.login(config.token);
