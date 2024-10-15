import type { Client } from "discord.js";
import Listener from "../Listener";

export default class Ready extends Listener {
    public constructor() {
        super("ready", true);
    }

    public override async execute(client: Client<true>) {
        console.log(`Đã đăng nhập tại ${client.user.tag}`);
        await client.application.commands.set(client.commands.toArray());
    }
}
