import { Collection } from "discord.js"
import type Command from "../commands/Command"

declare module "discord.js" {
    interface Client {
        commands: Collection<string, Command>;
    }
}

export {}