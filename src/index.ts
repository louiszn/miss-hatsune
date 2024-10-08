import { Client, Collection, GatewayIntentBits } from "discord.js";
import { loadCommands, loadEvents } from "./utils/loader";
import mongoose from "mongoose";

const { MONGO_URI: mongoURI, BOT_TOKEN: token, NODE_ENV: nodeEnv } = process.env;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.commands = new Collection();

mongoose.connection.on("connected", () => console.log("Đã kết nối tới MongoDB"));

await Promise.all([
    loadEvents(client),
    loadCommands(client),
    mongoose.connect(mongoURI!, {
        dbName: nodeEnv === "development" ? "dev" : "prod",
    }),
]);

await client.login(token);
