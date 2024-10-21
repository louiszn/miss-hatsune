import type Redis from "ioredis";

import type CommandManager from "../managers/CommandManager";
import type ModuleManager from "../managers/ModuleManager";
import type ComponentManager from "../managers/ComponentManager";

import type config from "../config";

declare module "discord.js" {
    interface Client {
        commands: CommandManager;
        components: ComponentManager;
        modules: ModuleManager;
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
