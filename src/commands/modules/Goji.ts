import {
    ApplicationCommandType,
    ContextMenuCommandBuilder,
    EmbedBuilder,
    SlashCommandBuilder,
    type ContextMenuCommandType,
} from "npm:discord.js";

import Command from "../Command.ts";
import Goji from "../../models/Goji.ts";
import GojiMessage from "../../models/GojiMessage.ts";

const SUPPORTED_EXTENSIONS = ["jpeg", "png"];
const GOJI_EXISTED = "Cậu đã có Goji khác dùng tên này!";
const GOJI_NOT_FOUND = "Không tìm thấy Goji nào!";

export default class extends Command {
    public constructor() {
        super("goji");

        this.applicationCommands.push(
            new SlashCommandBuilder()
                .setName(this.name)
                .setDescription("Module Goji")
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("create")
                        .setDescription("Tạo Goji mới")
                        .addStringOption((option) =>
                            option
                                .setName("name")
                                .setDescription("Tên Goji")
                                .setRequired(true)
                                .setMaxLength(60)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("delete")
                        .setDescription("Xoá Goji")
                        .addStringOption((option) =>
                            option
                                .setName("name")
                                .setDescription("Tên Goji để xoá")
                                .setRequired(true)
                                .setMaxLength(60)
                                .setAutocomplete(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("list")
                        .setDescription("Liệt kê danh sách Goji mà cậu có")
                )
                .addSubcommandGroup((group) =>
                    group
                        .setName("update")
                        .setDescription("Cập nhật thông tin cho Goji")
                        .addSubcommand((subcommand) =>
                            subcommand
                                .setName("name")
                                .setDescription("Đổi tên cho Goji")
                                .addStringOption((option) =>
                                    option
                                        .setName("goji")
                                        .setDescription(
                                            "Goji mà cậu muốn đổi tên"
                                        )
                                        .setRequired(true)
                                        .setMaxLength(60)
                                        .setAutocomplete(true)
                                )
                                .addStringOption((option) =>
                                    option
                                        .setName("name")
                                        .setDescription("Tên mới cho Goji")
                                        .setRequired(true)
                                        .setMaxLength(60)
                                )
                        )
                        .addSubcommand((subcommand) =>
                            subcommand
                                .setName("prefix")
                                .setDescription("Cập nhật prefix của Goji")
                                .addStringOption((option) =>
                                    option
                                        .setName("goji")
                                        .setDescription(
                                            "Goji mà cậu muốn cập nhật"
                                        )
                                        .setRequired(true)
                                        .setMaxLength(60)
                                        .setAutocomplete(true)
                                )
                                .addStringOption((option) =>
                                    option
                                        .setName("prefix")
                                        .setDescription(
                                            "Prefix mới cho Goji dùng để khởi tạo tin nhắn"
                                        )
                                        .setRequired(true)
                                )
                        )
                        .addSubcommand((subcommand) =>
                            subcommand
                                .setName("avatar")
                                .setDescription(
                                    "Cập nhật ảnh đại diện của Goji"
                                )
                                .addStringOption((option) =>
                                    option
                                        .setName("goji")
                                        .setDescription(
                                            "Goji mà cậu muốn cập nhật"
                                        )
                                        .setRequired(true)
                                        .setMaxLength(60)
                                        .setAutocomplete(true)
                                )
                                .addAttachmentOption((option) =>
                                    option
                                        .setName("avatar")
                                        .setDescription(
                                            "Ảnh đại diện mới cho Goji"
                                        )
                                        .setRequired(true)
                                )
                        )
                )
                .toJSON(),
            new ContextMenuCommandBuilder()
                .setName("Xoá tin nhắn của Goji")
                .setType(
                    ApplicationCommandType.Message as ContextMenuCommandType
                )
                .toJSON()
        );

        this.subcommands[this.name] = [
            {
                name: "create",
                target: "create",
            },
            {
                name: "delete",
                target: "delete",
            },
            {
                name: "list",
                target: "list",
            },
            {
                name: "update",
                subcommands: [
                    {
                        name: "name",
                        target: "update_name",
                    },
                    {
                        name: "prefix",
                        target: "update_prefix",
                    },
                    {
                        name: "avatar",
                        target: "update_avatar",
                    },
                ],
            },
        ];
    }

    public override async executeAutocomplete(
        interaction: Command.Autocomplete
    ) {
        const focused = interaction.options.getFocused(true);

        if (focused.name === "goji") {
            const gojis = await Goji.find({
                authorId: interaction.user.id,
                guildId: interaction.guildId,
            });

            const results = gojis
                .filter(
                    (g) =>
                        g.name
                            .toUpperCase()
                            .search(focused.value.toUpperCase()) !== -1
                )
                .slice(0, 25); // Giới hạn API chỉ cho list 25 item một lần :/

            await interaction.respond(
                results.map((r) => ({ name: r.name, value: r.name }))
            );
        }
    }

    public override async executeMessageContextMenu(
        interaction: Command.MessageContentMenu
    ) {
        const { targetMessage, channelId, user, guildId } = interaction;

        const { client } = this;
        const { config } = client;

        const gojiMessage = await GojiMessage.findOne({
            guildId,
            channelId,
            messageId: targetMessage.id,
        });

        if (!gojiMessage) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            "❌ Tin nhắn này không có trong dữ liệu của tớ"
                        )
                        .setColor(config.colors.error),
                ],
                ephemeral: true,
            });

            return;
        }

        if (gojiMessage.authorId !== user.id) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("❌ Goji này không phải của cậu!")
                        .setColor(config.colors.error),
                ],
                ephemeral: true,
            });

            return;
        }

        await interaction.deferReply({ ephemeral: true });

        await targetMessage.delete();
        await gojiMessage.deleteOne();

        await interaction.deleteReply();
    }

    protected async _create(interaction: Command.ChatInput) {
        const { options, guildId, user } = interaction;

        const { client } = this;
        const { config } = client;

        const name = options.getString("name", true);

        const existed = await Goji.findOne({
            name,
            guildId,
            authorId: user.id,
        });

        if (existed) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(name)
                        .setDescription("❌ " + GOJI_EXISTED)
                        .setThumbnail(existed.avatarURL || null)
                        .setColor(config.colors.error),
                ],
            });

            return;
        }

        await new Goji({
            name,
            guildId,
            authorId: user.id,
        }).save();

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(name)
                    .setDescription("✅ Đã tạo một Goji mới!")
                    .setColor(client.config.colors.default),
            ],
        });
    }

    protected async _delete(interaction: Command.ChatInput) {
        const { options, guildId, user } = interaction;

        const { client } = this;
        const { config } = client;

        const name = options.getString("goji", true);

        const goji = await Goji.findOne({
            name,
            guildId,
            authorId: user.id,
        });

        if (!goji) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(name)
                        .setDescription("❌ " + GOJI_NOT_FOUND)
                        .setColor(config.colors.error),
                ],
            });

            return;
        }

        await goji.deleteOne();

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(name)
                    .setDescription("✅ Đã xoá Goji này!")
                    .setThumbnail(goji.avatarURL || null)
                    .setColor(config.colors.default),
            ],
        });
    }

    protected async _list(interaction: Command.ChatInput) {
        const { guildId, user } = interaction;

        const { client } = this;
        const { config } = client;

        const gojis = await Goji.find({
            guildId,
            authorId: user.id,
        });

        const info = gojis
            .map(
                (g) =>
                    `- **${g.name}** - prefix: ${
                        g.prefix ? `\`${g.prefix}\`` : "None"
                    }`
            )
            .join("\n");

        const embed = new EmbedBuilder()
            .setDescription(gojis.length ? info : "Cậu không có Goji nào cả")
            .setColor(config.colors.default);

        await interaction.reply({
            embeds: [embed],
        });
    }

    protected async _update_name(interaction: Command.ChatInput) {
        const { options, guildId, user } = interaction;

        const { client } = this;
        const { config } = client;

        const name = options.getString("goji", true);
        const newName = options.getString("name", true);

        const goji = await Goji.findOne({
            name,
            guildId,
            authorId: user.id,
        });

        if (!goji) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(name)
                        .setDescription("❌ " + GOJI_NOT_FOUND)
                        .setColor(config.colors.error),
                ],
            });

            return;
        }

        await goji.updateOne({ name: newName });

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(newName)
                    .setDescription(`✅ Đã đổi tên Goji!`)
                    .setThumbnail(goji.avatarURL || null)
                    .setColor(config.colors.default),
            ],
        });
    }

    protected async _update_prefix(interaction: Command.ChatInput) {
        const { options, guildId, user } = interaction;

        const { client } = this;
        const { config } = client;

        const name = options.getString("goji", true);
        const prefix = options.getString("prefix", true);

        const goji = await Goji.findOne({
            name,
            guildId,
            authorId: user.id,
        });

        if (!goji) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(name)
                        .setDescription("❌ " + GOJI_NOT_FOUND)
                        .setColor(config.colors.error),
                ],
            });

            return;
        }

        await goji.updateOne({ prefix });

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(name)
                    .setDescription(`✅ Đã update prefix thành \`${prefix}\``)
                    .setThumbnail(goji.avatarURL || null)
                    .setColor(config.colors.default),
            ],
        });
    }

    protected async _update_avatar(interaction: Command.ChatInput) {
        const { options, guildId, user } = interaction;

        const { client } = this;
        const { config } = client;

        const name = options.getString("goji", true);
        const avatar = options.getAttachment("avatar", true);

        const goji = await Goji.findOne({
            name,
            guildId,
            authorId: user.id,
        });

        if (!goji) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(name)
                        .setDescription("❌ " + GOJI_NOT_FOUND)
                        .setColor(config.colors.error),
                ],
            });

            return;
        }

        if (
            !SUPPORTED_EXTENSIONS.some((x) =>
                avatar.contentType?.startsWith(`image/${x}`)
            )
        ) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `❌ Định dạng không hỗ trợ! (${SUPPORTED_EXTENSIONS.join(
                                ", "
                            )})`
                        )
                        .setColor(config.colors.error),
                ],
            });

            return;
        }

        await goji.updateOne({ avatarURL: avatar.url });

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(name)
                    .setDescription(`✅ Đã update ảnh đại diện thành công!`)
                    .setThumbnail(avatar.url)
                    .setColor(config.colors.default),
            ],
        });
    }
}
