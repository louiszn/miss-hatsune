import { EmbedBuilder, SlashCommandBuilder, type Awaitable } from "discord.js";
import Command from "../Command";

export default class extends Command {
    public constructor() {
        super("avatar");

        this.applicationCommands.push(
            new SlashCommandBuilder()
                .setName(this.name)
                .setDescription("Xem avatar thành viên trong server")
                .addUserOption((option) =>
                    option.setName("target").setDescription("Chọn người mà cậu muốn xem")
                )
                .toJSON()
        );
    }

    public override async executeChatInput(interaction: Command.ChatInput) {
        const target = interaction.options.getUser("target") || interaction.user;

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setImage(target.displayAvatarURL({ size: 4096 }))
                    .setDescription(`${target.tag} - ${target}`),
            ],
        });
    }
}
