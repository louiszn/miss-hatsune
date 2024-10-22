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
                        .setDescription("Chọn người mà cậu muốn xem")
                )
                .toJSON()
        );
    }

    public override async executeChatInput(interaction: Command.ChatInput) {
        const { options, user } = interaction;

        const { client } = this;
        const { config } = client;

        const target = await client.users.fetch(
            (options.getUser("target") || user).id,
            {
                force: true,
            }
        );

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setImage(target.displayAvatarURL({ size: 4096 }))
                    .setDescription(`${target.tag} - ${target}`)
                    .setColor(target.hexAccentColor || config.colors.default),
            ],
        });
    }
}
