import { Message } from "discord.js";
import Command from "../Command";

export default class Ping extends Command {
    public constructor() {
        super("ping");
    }

    public override async executeMessage(message: Message<true>) {
        await message.channel.send({
            content: `Pong! ${message.client.ws.ping}ms!`
        });
    }
}
