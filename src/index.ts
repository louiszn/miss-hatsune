import { Client, GatewayIntentBits } from "discord.js";
import { loadCommands, loadEvents } from "./utils/loader";
import Redis from "ioredis";
import mongoose from "mongoose";

import CommandManager from "./utils/managers/CommandManager";

const {
    MONGO_URI: mongoURI,
    REDIS_URI: redisURI,
    BOT_TOKEN: token,
    NODE_ENV: nodeEnv,
} = process.env;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.commands = new CommandManager(client);
client.redis = new Redis(redisURI!);

client.redis.on("connect", () => console.log("Đã kết nối tới Redis"));
mongoose.connection.on("connected", () => console.log("Đã kết nối tới MongoDB"));

await Promise.all([
    loadEvents(client),
    loadCommands(client),
    mongoose.connect(mongoURI!, {
        dbName: nodeEnv === "development" ? "dev" : "prod",
    }),
]);

await client.login(token);
