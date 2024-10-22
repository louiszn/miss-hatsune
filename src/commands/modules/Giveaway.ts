import {
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from "npm:discord.js";
import ms from "ms";
import Command from "../Command.ts";

export default class extends Command {
    public constructor() {
        super("giveaway");

        this.applicationCommands.push(
            new SlashCommandBuilder()
                .setName("giveaway")
                .setDescription("Module giveaway")
                .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("start")
                        .setDescription("Bắt đầu một đợt giveaway mới")
                        .addStringOption((option) =>
                            option
                                .setName("prize")
                                .setDescription("Tên giveaway")
                                .setRequired(true)
                                .setMaxLength(50),
                        )
                        .addStringOption((option) =>
                            option
                                .setName("duration")
                                .setDescription(
                                    "Thời gian giveaway kết thúc (5d, 5h, 5m, 5s, ...)",
                                )
                                .setRequired(true),
                        )
                        .addIntegerOption((option) =>
                            option
                                .setName("winners")
                                .setDescription("Số lượng người thắng giveaway")
                                .setRequired(true)
                                .setMinValue(1)
                                .setMaxValue(15),
                        ),
                )
                .toJSON(),
        );

        this.subcommands["giveaway"] = [
            {
                name: "start",
                target: "start",
            },
        ];
    }

    protected async _start(interaction: Command.ChatInput) {
        const { channel, guildId, user, options, client } = interaction;
        const { config, modules } = client;

        const prize = options.getString("prize", true);
        const duration: number | undefined = ms(
            options.getString("duration", true),
        );
        const winners = options.getInteger("winners", true);

        if (typeof duration === "undefined") {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            "❌ Cú pháp thời gian không hợp lệ (5d, 5h, 5m, 5s).",
                        )
                        .setColor(config.colors.error),
                ],
                ephemeral: true,
            });

            return;
        }

        if (duration < 5_000 || duration >= 30 * 24 * 60 * 60 * 1_000) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            "❌ Thời gian tối thiểu là 5 giây và tối đa là 30 ngày.",
                        )
                        .setColor(config.colors.error),
                ],
                ephemeral: true,
            });

            return;
        }

        await modules.giveaway.create(
            guildId,
            channel!.id,
            user.id,
            prize,
            winners,
            new Date(Date.now() + duration),
        );

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription("✅ Đã tạo giveaway mới.")
                    .setColor(config.colors.default),
            ],
            ephemeral: true,
        });
    }
}
