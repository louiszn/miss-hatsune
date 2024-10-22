import { pathToFileURL } from "node:url";

import type { Client } from "npm:discord.js";
import { glob } from "npm:glob";

import type Listener from "../events/Listener.ts";
import type Command from "../commands/Command.ts";
import type Component from "../components/Component.ts";

export async function loadEvents(client: Client): Promise<void> {
    for (const path of await glob("src/events/*/**/*.ts")) {
        const listener: Listener = new (
            await import(`${pathToFileURL(path)}`)
        ).default();

        listener.client = client;

        client[listener.once ? "once" : "on"](
            listener.name,
            listener.execute!.bind(listener)
        );
    }
}

export async function loadCommands(client: Client): Promise<void> {
    for (const path of await glob("src/commands/*/**/*.ts")) {
        const command: Command = new (
            await import(`${pathToFileURL(path)}`)
        ).default();

        client.commands.add(command);
    }
}

export async function loadComponents(client: Client): Promise<void> {
    for (const path of await glob("src/components/*/**/*.ts")) {
        const component: Component = new (
            await import(`${pathToFileURL(path)}`)
        ).default();

        client.components.add(component);
    }
}
