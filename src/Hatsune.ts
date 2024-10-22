import { Client, GatewayIntentBits } from "npm:discord.js";
import { Redis } from "npm:ioredis";
import mongoose from "mongoose";

import config from "./config.ts";

import CommandManager from "./managers/CommandManager.ts";
import ComponentManager from "./managers/ComponentManager.ts";
import ModuleManager from "./managers/ModuleManager.ts";

import { getCommands, getComponents, getListeners } from "./utils/index.ts";

class Hatsune<R extends boolean = boolean> extends Client<R> {
    public config = config;

    public commands: CommandManager;
    public components: ComponentManager;
    public modules: ModuleManager;

    public redis: Redis;

    public constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildModeration,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.MessageContent,
            ],
        });

        this.commands = new CommandManager(this as Hatsune<true>);
        this.components = new ComponentManager(this as Hatsune<true>);
        this.modules = new ModuleManager(this as Hatsune<true>);

        this.redis = new Redis(config.redisURI, { lazyConnect: true });

        const { connection } = mongoose;

        this.redis.on("ready", () => console.log("Đã kết nối tới Redis"));
        connection.on("connected", () => console.log("Đã kết nối tới MongoDB"));
    }

    public async init() {
        for (const listener of await getListeners()) {
            listener.client = this as Hatsune<true>;

            const method = listener.once ? "once" : "on";

            this[method](listener.name, listener.execute!.bind(listener));
        }

        for (const command of await getCommands()) {
            this.commands.add(command);
        }

        for (const component of await getComponents()) {
            this.components.add(component);
        }

        const dbName = Deno.env.get("PROCESS_ENV") === "development" ? "dev" : "prod"

        await mongoose.connect(config.mongoURI, { dbName });
        await this.redis.connect();

        await this.login(config.token);
    }
}

export default Hatsune;
