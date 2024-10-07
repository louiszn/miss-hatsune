import type { Message } from "discord.js";
import Listener from "../Listener";

export default class CommandHandling extends Listener {
    public constructor() {
        super("messageCreate");
    }

    public override async execute(message: Message<true>) {
        if (!message.guild || message.author.bot) {
            return;
        }

        const prefix = "!";

        if (!message.content.startsWith(prefix)) {
            return;
        }

        const [name, ...args] = message.content.trim().slice(prefix.length).split(/ +/g);

        console.log(name);

        const command = message.client.commands.get(name);

        if (!command) {
            return;
        }

        await command.executeMessage?.(message, ...args);
    }
}
