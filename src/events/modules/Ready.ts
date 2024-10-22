import type { Client } from "npm:discord.js";
import Listener from "../Listener.ts";

export default class extends Listener {
    public constructor() {
        super("ready");
    }

    public override execute(client: Client<true>) {
        const { modules } = client;

        modules.giveaway.start();
        modules.tempVoice.start();
    }
}