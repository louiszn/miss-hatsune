import type Redis from "ioredis";
import type CommandManager from "../utils/managers/CommandManager";
import type config from "../config";

declare module "discord.js" {
    interface Client {
        commands: CommandManager;
        redis: Redis;
        config: typeof config;
    }
}

declare module "bun" {
    interface Env {
        BOT_TOKEN: string;
        MONGO_URI: string;
        REDIS_URI: string;
    }
}

export {};
