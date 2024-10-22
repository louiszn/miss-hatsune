import { EmbedBuilder, SlashCommandBuilder } from "npm:discord.js";
import Command from "../Command.ts";

export default class extends Command {
    public constructor() {
        super("avatar");

        this.applicationCommands.push(
            new SlashCommandBuilder()
                .setName(this.name)
                .setDescription("Xem avatar thành viên trong server")
                .addUserOption((option) =>
                    option
                        .setName("target")
                        .setDescription("Chọn người mà cậu muốn xem"),
                )
                .toJSON(),
        );
    }

    public override async executeChatInput(interaction: Command.ChatInput) {
        const target = await this.client.users.fetch(
            (interaction.options.getUser("target") || interaction.user).id,
            {
                force: true,
            },
        );

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setImage(target.displayAvatarURL({ size: 4096 }))
                    .setDescription(`${target.tag} - ${target}`)
                    .setColor(
                        target.hexAccentColor ||
                            this.client.config.colors.default,
                    ),
            ],
        });
    }
}
