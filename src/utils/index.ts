import { glob } from "npm:glob";
import { pathToFileURL } from "node:url";

import type Command from "../commands/Command.ts";
import type Listener from "../events/Listener.ts";
import type Component from "../components/Component.ts";

export function sleep(duration: number) {
    return new Promise((resolve) => setTimeout(resolve, duration));
}

export async function getListeners(): Promise<Listener[]> {
    const listeners: Listener[] = [];

    for (const file of await glob("src/events/*/**/*.ts")) {
        const fileURL = `${pathToFileURL(file)}`;
        const listener = new (await import(fileURL)).default();
        listeners.push(listener);
    }

    return listeners;
}

export async function getCommands(): Promise<Command[]> {
    const commands: Command[] = [];

    for (const file of await glob("src/commands/*/**/*.ts")) {
        const fileURL = `${pathToFileURL(file)}`;
        const command = new (await import(fileURL)).default();
        commands.push(command);
    }

    return commands;
}

export async function getComponents(): Promise<Component[]> {
    const components: Component[] = [];

    for (const file of await glob("src/components/*/**/*.ts")) {
        const fileURL = `${pathToFileURL(file)}`;
        const component = new (await import(fileURL)).default();
        components.push(component);
    }

    return components;
}
