import { SlashCommandBuilder } from "discord.js";
import Command from "../Command";

export default class Ping extends Command {
    public constructor() {
        super("ping", [
            new SlashCommandBuilder()
                .setName("ping")
                .setDescription("Xem tốc độ phản hồi của bot")
                .toJSON(),
        ]);
    }

    public override async executeChatInput(interaction: Command.ChatInput) {
        await interaction.reply({
            content: `Pong! ${this.client.ws.ping}ms!`,
            ephemeral: true,
        });
    }
}
