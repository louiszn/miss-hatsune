import type Redis from "ioredis";
import type CommandManager from "../utils/managers/CommandManager";

declare module "discord.js" {
    interface Client {
        commands: CommandManager;
        redis: Redis
    }
}

export {};
