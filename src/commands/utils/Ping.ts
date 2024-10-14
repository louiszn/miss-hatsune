import { SlashCommandBuilder } from "discord.js";
import Command from "../Command";

export default class extends Command {
    public constructor() {
        super("ping");

        this.applicationCommands.push(
            new SlashCommandBuilder()
                .setName(this.name)
                .setDescription("Xem tốc độ phản hồi của bot")
                .toJSON()
        );
    }

    public override async executeChatInput(interaction: Command.ChatInput) {
        await interaction.reply({
            content: `🏓 Pong! ${this.client.ws.ping}ms!`,
            ephemeral: true,
        });
    }
}
