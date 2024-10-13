import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "../Command";

export default class Ping extends Command {
    public constructor() {
        super("ping");

        this.applicationCommands.push(
            new SlashCommandBuilder()
                .setName("ping")
                .setDescription("Xem tốc độ phản hồi của bot")
                .toJSON()
        );
    }

    public override async executeChatInput(interaction: Command.ChatInput) {
        const { config } = this.client;

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Pong! ${this.client.ws.ping}ms!`)
                    .setColor(config.colors.default),
            ],
            ephemeral: true,
        });
    }
}
