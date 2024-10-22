import type { Redis } from "npm:ioredis";

import type CommandManager from "../managers/CommandManager.ts";
import type ModuleManager from "../managers/ModuleManager.ts";
import type ComponentManager from "../managers/ComponentManager.ts";

import type config from "../config.ts";

declare module "npm:discord.js" {
    interface Client {
        commands: CommandManager;
        components: ComponentManager;
        modules: ModuleManager;
        redis: Redis;
        config: typeof config;
    }
}

export {};
