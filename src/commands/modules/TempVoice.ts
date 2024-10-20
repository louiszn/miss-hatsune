import {
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
    PermissionOverwrites,
    SlashCommandBuilder,
} from "discord.js";
import Command from "../Command";
import TempVoice from "../../models/TempVoice";
import TempVoiceCreator from "../../models/TempVoiceCreator";

export default class extends Command {
    public constructor() {
        super("temp-voice");

        this.applicationCommands.push(
            new SlashCommandBuilder()
                .setName(this.name)
                .setDescription("Module temp voice")
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("setup")
                        .setDescription("Setup kênh dùng để tạo kênh mới")
                        .addChannelOption((option) =>
                            option
                                .setName("channel")
                                .setDescription("Kênh dùng để tạo")
                                .setRequired(false)
                                .addChannelTypes(ChannelType.GuildVoice),
                        ),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("lock")
                        .setDescription("Khoá kênh hiện tại"),
                )
                .toJSON(),
        );

        this.subcommands[this.name] = [
            {
                name: "setup",
                target: "setup",
                permissions: [PermissionFlagsBits.ManageChannels],
            },
            {
                name: "lock",
                target: "lock",
            },
        ];
    }

    public async _setup(interaction: Command.ChatInput) {
        const { options, guild, client } = interaction;
        const { config } = client;

        let channel = options.getChannel("channel", false, [
            ChannelType.GuildVoice,
        ]);

        if (channel) {
            const existed = await TempVoiceCreator.findOne({
                guildId: guild.id,
                channelId: channel.id,
            });

            if (existed) {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(
                                `Kênh ${channel} đã được đặt làm kênh khởi tạo từ trước.`,
                            )
                            .setColor(config.colors.error),
                    ],
                });

                return;
            }
        } else {
            channel = await guild.channels.create({
                name: "Tạo kênh thoại",
                type: ChannelType.GuildVoice,
            });
        }

        await new TempVoiceCreator({
            guildId: guild.id,
            channelId: channel.id,
        }).save();

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Đã đặt ${channel} làm kênh khởi tạo!`)
                    .setColor(config.colors.default),
            ],
        });
    }

    protected async _lock(interaction: Command.ChatInput) {
        const { guildId, user, member, client } = interaction;
        const { config } = client;

        const tempVoice = await TempVoice.findOne({
            guildId: guildId,
            ownerId: user.id,
            channelId: member.voice.channelId,
        });

        if (!tempVoice || !member.voice.channel) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            "❌ Cậu đang không ở trong một kênh thoại tạm thời.",
                        )
                        .setColor(config.colors.error),
                ],
                ephemeral: true,
            });

            return;
        }

        if (tempVoice.ownerId !== user.id) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("❌ Kênh thoại này không phải của cậu.")
                        .setColor(config.colors.error),
                ],
                ephemeral: true,
            });

            return;
        }

        const { channel } = member.voice;

        await channel.edit({
            permissionOverwrites: [
                {
                    id: user.id,
                    allow: [PermissionFlagsBits.Connect],
                },
                {
                    id: guildId,
                    deny: [PermissionFlagsBits.Connect],
                },
            ],
        });

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Đã khoá kênh!`)
                    .setColor(config.colors.default),
            ],
        });
    }
}
