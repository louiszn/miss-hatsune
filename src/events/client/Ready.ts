import type { Client } from "discord.js";
import Listener from "../Listener";

export default class Ready extends Listener {
    public constructor() {
        super("ready", true);
    }

    public override async execute(client: Client<true>) {
        console.log(`Đã đăng nhập tại ${client.user.tag}`);

        const commands = client.commands.map((c) => c.applicationCommands).flat();
        
        if (commands.length) {
            await client.application.commands.set(commands);
        }
    }
}
