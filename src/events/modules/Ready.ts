import type { Client } from "discord.js";
import Listener from "../Listener";

export default class extends Listener {
    public constructor() {
        super("ready");
    }

    public override async execute(client: Client<true>) {
        const { modules } = client;

        modules.giveaway.start();
        modules.tempVoice.start();
    }
}