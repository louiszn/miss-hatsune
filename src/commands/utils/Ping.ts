import { EmbedBuilder, SlashCommandBuilder } from "npm:discord.js";
import Command from "../Command.ts";

export default class extends Command {
    public constructor() {
        super("ping");

        this.applicationCommands.push(
            new SlashCommandBuilder()
                .setName(this.name)
                .setDescription("Xem tốc độ phản hồi của bot")
                .toJSON(),
        );
    }

    public override async executeChatInput(interaction: Command.ChatInput) {
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`🏓 Pong! ${this.client.ws.ping}ms!`)
                    .setColor(this.client.config.colors.default),
            ],
            ephemeral: true,
        });
    }
}
