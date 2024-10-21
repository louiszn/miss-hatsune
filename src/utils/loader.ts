import type { Client } from "discord.js";
import { Glob } from "bun";

import type Listener from "../events/Listener";
import type Command from "../commands/Command";
import type Component from "../components/Component";

const glob = new Glob("*/**/*.ts");

export async function loadEvents(client: Client): Promise<void> {
    for await (const path of glob.scan("src/events")) {
        const listener: Listener = new (
            await import(`../events/${path}`)
        ).default();

        listener.client = client;

        client[listener.once ? "once" : "on"](
            listener.name,
            listener.execute!.bind(listener),
        );
    }
}

export async function loadCommands(client: Client): Promise<void> {
    for await (const path of glob.scan("src/commands")) {
        const command: Command = new (
            await import(`../commands/${path}`)
        ).default();

        client.commands.add(command);
    }
}

export async function loadComponents(client: Client): Promise<void> {
    for await (const path of glob.scan("src/components")) {
        const component: Component = new (
            await import(`../components/${path}`)
        ).default();

        client.components.add(component);
    }
}
