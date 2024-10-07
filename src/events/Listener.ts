import type { Awaitable, Client, ClientEvents } from "discord.js";

type EventKey = keyof ClientEvents;

abstract class Listener<T extends EventKey = EventKey> {
    public name: T;
    public once: boolean;
    public client!: Client;

    public constructor(name: T, once: boolean = false) {
        this.name = name;
        this.once = once;
    }

    public execute?(...args: ClientEvents[T]): Awaitable<void>;
}

export default Listener;
