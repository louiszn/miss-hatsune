import {
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from "discord.js";

import Command from "../Command";
import TempVoice from "../../models/TempVoice";
import TempVoiceCreator from "../../models/TempVoiceCreator";

const NOT_IN_TEMP_VOICE = "Cậu đang không ở trong 1 kênh thoại tạm thời.";
const NOT_OWNER = "Kênh thoại này không phải của cậu.";

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
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("unlock")
                        .setDescription("Mở khoá kênh hiện tại"),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("hide")
                        .setDescription("Ẩn kênh hiện tại"),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("unhide")
                        .setDescription("Tắt ẩn hiển thị cho kênh hiện tại"),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("claim")
                        .setDescription("Chiếm quyền sở hữu kênh hiện tại"),
                )
                .addSubcommandGroup((group) =>
                    group
                        .setName("whitelist")
                        .setDescription("Quản lý danh sách trắng")
                        .addSubcommand((subcommand) =>
                            subcommand
                                .setName("add")
                                .setDescription(
                                    "Thêm một người vào danh sách trắng",
                                )
                                .addUserOption((option) =>
                                    option
                                        .setName("user")
                                        .setDescription(
                                            "Người mà cậu muốn thêm",
                                        )
                                        .setRequired(true),
                                ),
                        )
                        .addSubcommand((subcommand) =>
                            subcommand
                                .setName("remove")
                                .setDescription(
                                    "Loại bỏ một người khỏi danh sách trắng",
                                )
                                .addUserOption((option) =>
                                    option
                                        .setName("user")
                                        .setDescription(
                                            "Người mà cậu muốn loại bỏ",
                                        )
                                        .setRequired(true),
                                ),
                        )
                        .addSubcommand((subcommand) =>
                            subcommand
                                .setName("list")
                                .setDescription(
                                    "Xem danh sách những người đã được thêm vào danh sách trắng",
                                ),
                        ),
                )
                .addSubcommandGroup((group) =>
                    group
                        .setName("blacklist")
                        .setDescription("Quản lý danh sách đen")
                        .addSubcommand((subcommand) =>
                            subcommand
                                .setName("add")
                                .setDescription(
                                    "Thêm một người vào danh sách đen",
                                )
                                .addUserOption((option) =>
                                    option
                                        .setName("user")
                                        .setDescription(
                                            "Người mà cậu muốn thêm",
                                        )
                                        .setRequired(true),
                                ),
                        )
                        .addSubcommand((subcommand) =>
                            subcommand
                                .setName("remove")
                                .setDescription(
                                    "Loại bỏ một người khỏi danh sách đen",
                                )
                                .addUserOption((option) =>
                                    option
                                        .setName("user")
                                        .setDescription(
                                            "Người mà cậu muốn loại bỏ",
                                        )
                                        .setRequired(true),
                                ),
                        )
                        .addSubcommand((subcommand) =>
                            subcommand
                                .setName("list")
                                .setDescription(
                                    "Xem danh sách những người đã được thêm vào danh sách trắng",
                                ),
                        ),
                )
                .addSubcommandGroup((group) =>
                    group
                        .setName("manager")
                        .setDescription("Quản lý danh sách manager")
                        .addSubcommand((subcommand) =>
                            subcommand
                                .setName("add")
                                .setDescription(
                                    "Thêm một người vào danh manager",
                                )
                                .addUserOption((option) =>
                                    option
                                        .setName("user")
                                        .setDescription(
                                            "Người mà cậu muốn thêm",
                                        )
                                        .setRequired(true),
                                ),
                        )
                        .addSubcommand((subcommand) =>
                            subcommand
                                .setName("remove")
                                .setDescription(
                                    "Loại bỏ một người khỏi danh sách manager",
                                )
                                .addUserOption((option) =>
                                    option
                                        .setName("user")
                                        .setDescription(
                                            "Người mà cậu muốn loại bỏ",
                                        )
                                        .setRequired(true),
                                ),
                        )
                        .addSubcommand((subcommand) =>
                            subcommand
                                .setName("list")
                                .setDescription(
                                    "Xem danh sách những người đã được thêm vào danh sách manager",
                                ),
                        ),
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
            {
                name: "unlock",
                target: "unlock",
            },
            {
                name: "hide",
                target: "hide",
            },
            {
                name: "unhide",
                target: "unhide",
            },
            {
                name: "claim",
                target: "claim",
            },
            {
                name: "whitelist",
                subcommands: [
                    {
                        name: "add",
                        target: "whitelist_add",
                    },
                    {
                        name: "remove",
                        target: "whitelist_remove",
                    },
                    {
                        name: "list",
                        target: "whitelist_list",
                    },
                ],
            },
            {
                name: "blacklist",
                subcommands: [
                    {
                        name: "add",
                        target: "blacklist_add",
                    },
                    {
                        name: "remove",
                        target: "blacklist_remove",
                    },
                    {
                        name: "list",
                        target: "blacklist_list",
                    },
                ],
            },
            {
                name: "manager",
                subcommands: [
                    {
                        name: "add",
                        target: "manager_add",
                    },
                    {
                        name: "remove",
                        target: "manager_remove",
                    },
                    {
                        name: "list",
                        target: "manager_list",
                    },
                ],
            },
        ];
    }

    protected async _setup(interaction: Command.ChatInput) {
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

    private async validate(interaction: Command.ChatInput) {
        const { guildId, user, member, client } = interaction;
        const { config, modules } = client;

        const tempVoice = await TempVoice.findOne({
            guildId: guildId,
            channelId: member.voice.channelId,
        });

        if (!tempVoice || !member.voice.channel) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("❌ " + NOT_IN_TEMP_VOICE)
                        .setColor(config.colors.error),
                ],
                ephemeral: true,
            });

            return;
        }

        const userConfig = await modules.tempVoice.getUserConfig(user.id);

        if (!userConfig) {
            return;
        }

        if (
            tempVoice.ownerId !== user.id &&
            !userConfig.managers.includes(user.id)
        ) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("❌ " + NOT_OWNER)
                        .setColor(config.colors.error),
                ],
                ephemeral: true,
            });

            return;
        }

        return {
            tempVoice,
            userConfig,
        };
    }

    protected async _lock(interaction: Command.ChatInput) {
        const { member, client, user, guildId } = interaction;
        const { modules, config } = client;

        const data = await this.validate(interaction);

        if (!data) {
            return;
        }

        const { userConfig } = data;

        await userConfig?.updateOne({
            lock: true,
        });

        const { channel } = member.voice;

        const newChannelData = await modules.tempVoice.getChannelData(
            user.id,
            guildId,
        );

        if (newChannelData) {
            await channel!.edit(newChannelData);
        }

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`🔒 Đã khoá kênh!`)
                    .setColor(config.colors.default),
            ],
        });
    }

    protected async _unlock(interaction: Command.ChatInput) {
        const { member, client, user, guildId } = interaction;
        const { modules, config } = client;

        const data = await this.validate(interaction);

        if (!data) {
            return;
        }

        const { userConfig } = data;

        await userConfig.updateOne({
            lock: false,
        });

        const { channel } = member.voice;

        const newChannelData = await modules.tempVoice.getChannelData(
            user.id,
            guildId,
        );

        if (newChannelData) {
            await channel!.edit(newChannelData);
        }

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`🔓 Đã mở khoá kênh!`)
                    .setColor(config.colors.default),
            ],
        });
    }

    protected async _hide(interaction: Command.ChatInput) {
        const { member, client, user, guildId } = interaction;
        const { modules, config } = client;

        const data = await this.validate(interaction);

        if (!data) {
            return;
        }

        const { userConfig } = data;

        await userConfig.updateOne({
            hide: true,
        });

        const { channel } = member.voice;

        const newChannelData = await modules.tempVoice.getChannelData(
            user.id,
            guildId,
        );

        if (newChannelData) {
            await channel!.edit(newChannelData);
        }

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`👀 Đã ẩn kênh!`)
                    .setColor(config.colors.default),
            ],
        });
    }

    protected async _unhide(interaction: Command.ChatInput) {
        const { member, client, user, guildId } = interaction;
        const { modules, config } = client;

        const data = await this.validate(interaction);

        if (!data) {
            return;
        }

        const { userConfig } = data;

        await userConfig.updateOne({
            hide: false,
        });

        const { channel } = member.voice;

        const newChannelData = await modules.tempVoice.getChannelData(
            user.id,
            guildId,
        );

        if (newChannelData) {
            await channel!.edit(newChannelData);
        }

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`👀 Đã hiển thị kênh!`)
                    .setColor(config.colors.default),
            ],
        });
    }

    protected async _claim(interaction: Command.ChatInput) {
        const { guildId, user, member, client } = interaction;
        const { config, modules } = client;

        const tempVoice = await TempVoice.findOne({
            guildId: guildId,
            channelId: member.voice.channelId,
        });

        if (!tempVoice || !member.voice.channel) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("❌ " + NOT_IN_TEMP_VOICE)
                        .setColor(config.colors.error),
                ],
                ephemeral: true,
            });

            return;
        }

        const { channel } = member.voice;

        if (channel.members.has(tempVoice.ownerId)) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            "❌ Cậu chỉ có thể chiếm quyền của kênh này khi chủ kênh không có ở trong!",
                        )
                        .setColor(config.colors.error),
                ],
                ephemeral: true,
            });

            return;
        }

        await tempVoice.updateOne({ ownerId: user.id });
        
        const newChannelData = await modules.tempVoice.getChannelData(
            user.id,
            guildId,
        );

        if (newChannelData) {
            await channel!.edit(newChannelData);
        }

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`✅ Đã chiếm quyền thành công!`)
                    .setColor(config.colors.default),
            ],
        });
    }

    protected async _whitelist_add(interaction: Command.ChatInput) {
        const { member, client, user, guildId, options } = interaction;
        const { modules, config } = client;

        const data = await this.validate(interaction);

        if (!data) {
            return;
        }

        const { userConfig } = data;

        const target = options.getUser("user", true);

        if (userConfig.whitelisted.includes(target.id)) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `${target} đã có trong danh sách trắng của cậu!`,
                        )
                        .setColor(config.colors.default),
                ],
            });

            return;
        }

        const bI = userConfig.blacklisted.indexOf(target.id);

        if (bI !== -1) {
            userConfig.blacklisted.splice(bI, 1);
        }

        userConfig.whitelisted.push(target.id);

        await userConfig.updateOne({
            whitelisted: userConfig.whitelisted,
            blacklisted: userConfig.blacklisted,
        });

        const { channel } = member.voice;

        const newChannelData = await modules.tempVoice.getChannelData(
            user.id,
            guildId,
        );

        if (newChannelData) {
            await channel!.edit(newChannelData);
        }

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`📃 Đã thêm ${target} vào danh sách trắng!`)
                    .setColor(config.colors.default),
            ],
        });
    }

    protected async _whitelist_remove(interaction: Command.ChatInput) {
        const { member, client, user, guildId, options } = interaction;
        const { modules, config } = client;

        const data = await this.validate(interaction);

        if (!data) {
            return;
        }

        const { userConfig } = data;

        const target = options.getUser("user", true);

        const wI = userConfig.whitelisted.indexOf(target.id);

        if (wI === -1) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `${target} không có trong danh sách trắng của cậu!`,
                        )
                        .setColor(config.colors.default),
                ],
            });

            return;
        }

        userConfig.whitelisted.splice(wI);

        await userConfig.updateOne({
            whitelisted: userConfig.whitelisted,
        });

        const { channel } = member.voice;

        const newChannelData = await modules.tempVoice.getChannelData(
            user.id,
            guildId,
        );

        if (newChannelData) {
            await channel!.edit(newChannelData);
        }

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`📃 Đã thêm ${target} vào danh sách trắng!`)
                    .setColor(config.colors.default),
            ],
        });
    }

    protected async _whitelist_list(interaction: Command.ChatInput) {
        const { client } = interaction;
        const { config } = client;

        const data = await this.validate(interaction);

        if (!data) {
            return;
        }

        const { userConfig } = data;

        const embed = new EmbedBuilder()
            .setTitle("Danh sách trắng:")
            .setDescription(
                userConfig.whitelisted.length
                    ? userConfig.whitelisted.map((u) => `${u}`).join(", ")
                    : "Không có ai trong trong danh sách cả",
            )
            .setColor(config.colors.default);

        await interaction.reply({
            embeds: [embed],
        });
    }

    protected async _blacklist_add(interaction: Command.ChatInput) {
        const { member, client, user, guildId, options } = interaction;
        const { modules, config } = client;

        const data = await this.validate(interaction);

        if (!data) {
            return;
        }

        const { userConfig } = data;

        const target = options.getUser("user", true);

        if (userConfig.blacklisted.includes(target.id)) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `${target} đã có trong danh sách đen của cậu!`,
                        )
                        .setColor(config.colors.default),
                ],
            });

            return;
        }

        const wI = userConfig.whitelisted.indexOf(target.id);

        if (wI !== -1) {
            userConfig.whitelisted.splice(wI, 1);
        }

        userConfig.blacklisted.push(target.id);

        await userConfig.updateOne({
            whitelisted: userConfig.whitelisted,
            blacklisted: userConfig.blacklisted,
        });

        const { channel } = member.voice;

        const newChannelData = await modules.tempVoice.getChannelData(
            user.id,
            guildId,
        );

        if (newChannelData) {
            await channel!.edit(newChannelData);
        }

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`📃 Đã thêm ${target} vào danh sách đen!`)
                    .setColor(config.colors.default),
            ],
        });
    }

    protected async _blacklist_remove(interaction: Command.ChatInput) {
        const { member, client, user, guildId, options } = interaction;
        const { modules, config } = client;

        const data = await this.validate(interaction);

        if (!data) {
            return;
        }

        const { userConfig } = data;

        const target = options.getUser("user", true);

        const bI = userConfig.whitelisted.indexOf(target.id);

        if (bI === -1) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `${target} không có trong danh sách đen của cậu!`,
                        )
                        .setColor(config.colors.default),
                ],
            });

            return;
        }

        userConfig.blacklisted.splice(bI);

        await userConfig.updateOne({
            blacklisted: userConfig.blacklisted,
        });

        const { channel } = member.voice;

        const newChannelData = await modules.tempVoice.getChannelData(
            user.id,
            guildId,
        );

        if (newChannelData) {
            await channel!.edit(newChannelData);
        }

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`📃 Đã thêm ${target} vào danh sách đen!`)
                    .setColor(config.colors.default),
            ],
        });
    }

    protected async _blacklist_list(interaction: Command.ChatInput) {
        const { client } = interaction;
        const { config } = client;

        const data = await this.validate(interaction);

        if (!data) {
            return;
        }

        const { userConfig } = data;

        const embed = new EmbedBuilder()
            .setTitle("Danh sách đen:")
            .setDescription(
                userConfig.blacklisted.length
                    ? userConfig.blacklisted.map((u) => `${u}`).join(", ")
                    : "Không có ai trong trong danh sách cả",
            )
            .setColor(config.colors.default);

        await interaction.reply({
            embeds: [embed],
        });
    }

    protected async _manager_add(interaction: Command.ChatInput) {
        const { member, client, user, guildId, options } = interaction;
        const { modules, config } = client;

        const data = await this.validate(interaction);

        if (!data) {
            return;
        }

        const { userConfig } = data;

        const target = options.getUser("user", true);

        if (userConfig.managers.includes(target.id)) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `${target} đã có trong danh sách manager của cậu!`,
                        )
                        .setColor(config.colors.default),
                ],
            });

            return;
        }

        const bI = userConfig.blacklisted.indexOf(target.id);

        if (bI !== -1) {
            userConfig.blacklisted.splice(bI, 1);
        }

        userConfig.managers.push(target.id);

        await userConfig.updateOne({
            managers: userConfig.managers,
            blacklisted: userConfig.blacklisted,
        });

        const { channel } = member.voice;

        const newChannelData = await modules.tempVoice.getChannelData(
            user.id,
            guildId,
        );

        if (newChannelData) {
            await channel!.edit(newChannelData);
        }

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `📃 Đã thêm ${target} vào danh sách manager!`,
                    )
                    .setColor(config.colors.default),
            ],
        });
    }

    protected async _manager_remove(interaction: Command.ChatInput) {
        const { member, client, user, guildId, options } = interaction;
        const { modules, config } = client;

        const data = await this.validate(interaction);

        if (!data) {
            return;
        }

        const { userConfig } = data;

        const target = options.getUser("user", true);

        const mI = userConfig.managers.indexOf(target.id);

        if (mI === -1) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `${target} không có trong danh sách manager của cậu!`,
                        )
                        .setColor(config.colors.default),
                ],
            });

            return;
        }

        userConfig.managers.splice(mI);

        await userConfig.updateOne({
            managers: userConfig.managers,
        });

        const { channel } = member.voice;

        const newChannelData = await modules.tempVoice.getChannelData(
            user.id,
            guildId,
        );

        if (newChannelData) {
            await channel!.edit(newChannelData);
        }

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `📃 Đã thêm ${target} vào danh sách manager!`,
                    )
                    .setColor(config.colors.default),
            ],
        });
    }

    protected async _manager_list(interaction: Command.ChatInput) {
        const { client } = interaction;
        const { config } = client;

        const data = await this.validate(interaction);

        if (!data) {
            return;
        }

        const { userConfig } = data;

        const embed = new EmbedBuilder()
            .setTitle("Danh sách trắng:")
            .setDescription(
                userConfig.managers.length
                    ? userConfig.managers.map((u) => `${u}`).join(", ")
                    : "Không có ai trong trong danh sách cả",
            )
            .setColor(config.colors.default);

        await interaction.reply({
            embeds: [embed],
        });
    }
}
