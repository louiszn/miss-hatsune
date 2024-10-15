import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "../Command";
import Goji from "../../models/Goji";

const SUPPORTED_EXTENSIONS = ["jpeg", "png"];

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
                .addSubcommandGroup((group) =>
                    group
                        .setName("update")
                        .setDescription("Update thông tin Goji")
                        .addSubcommand((subcommand) =>
                            subcommand
                                .setName("prefix")
                                .setDescription("Update prefix của Goji")
                                .addStringOption((option) =>
                                    option
                                        .setName("name")
                                        .setDescription("Tên Goji để update")
                                        .setRequired(true)
                                        .setMaxLength(60)
                                        .setAutocomplete(true)
                                )
                                .addStringOption((option) =>
                                    option
                                        .setName("prefix")
                                        .setDescription("Prefix dùng để khởi tạo tin nhắn")
                                        .setRequired(true)
                                )
                        )
                        .addSubcommand((subcommand) =>
                            subcommand
                                .setName("avatar")
                                .setDescription("Update avatar của Goji")
                                .addStringOption((option) =>
                                    option
                                        .setName("name")
                                        .setDescription("Tên Goji để update")
                                        .setRequired(true)
                                        .setMaxLength(60)
                                        .setAutocomplete(true)
                                )
                                .addAttachmentOption((option) =>
                                    option
                                        .setName("avatar")
                                        .setDescription("Avatar của Goji")
                                        .setRequired(true)
                                )
                        )
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
                name: "update",
                subcommands: [
                    {
                        name: "prefix",
                        target: "updatePrefix",
                    },
                    {
                        name: "avatar",
                        target: "updateAvatar",
                    },
                ],
            },
        ];
    }

    protected async _create(interaction: Command.ChatInput) {
        const {
            options,
            guildId,
            user: { id: authorId },
        } = interaction;

        const name = options.getString("name", true);

        const existed = await Goji.findOne({
            name,
            guildId,
            authorId,
        });

        if (existed) {
            await interaction.reply({
                content: "Cậu đã có một Goji khác dùng tên này!",
            });

            return;
        }

        await new Goji({
            name,
            guildId,
            authorId,
        }).save();

        await interaction.reply({
            content: "Đã tạo một Goji mới!",
        });
    }

    protected async _delete(interaction: Command.ChatInput) {
        const {
            options,
            guildId,
            user: { id: authorId },
        } = interaction;

        const name = options.getString("name", true);

        const goji = await Goji.findOne({
            name,
            guildId,
            authorId,
        });

        if (!goji) {
            await interaction.reply({
                content: "Không tìm thấy Goji nào với tên này :/",
            });

            return;
        }

        await goji.deleteOne();

        await interaction.reply({
            content: "Đã xoá một Goji!",
        });
    }

    protected async _updatePrefix(interaction: Command.ChatInput) {
        const {
            options,
            guildId,
            user: { id: authorId },
        } = interaction;

        const name = options.getString("name", true);
        const prefix = options.getString("prefix", true);

        const goji = await Goji.findOne({
            name,
            guildId,
            authorId,
        });

        if (!goji) {
            await interaction.reply({
                content: "Không tìm thấy Goji nào với tên này :/",
            });

            return;
        }

        await goji.updateOne({
            prefix,
        });

        await interaction.reply({
            content: `Đã update prefix của Goji **${goji.name}** thành \`${prefix}\``,
        });
    }

    protected async _updateAvatar(interaction: Command.ChatInput) {
        const {
            options,
            guildId,
            user: { id: authorId },
            client
        } = interaction;

        const { config } = client;

        const name = options.getString("name", true);
        const avatar = options.getAttachment("avatar", true);

        const goji = await Goji.findOne({
            name,
            guildId,
            authorId,
        });

        if (!goji) {
            await interaction.reply({
                content: "Không tìm thấy Goji nào với tên này :/",
            });

            return;
        }

        if (!SUPPORTED_EXTENSIONS.some((x) => avatar.contentType?.startsWith(`image/${x}`))) {
            await interaction.reply({
                content: "Định dạng không hợp lệ. Hãy thử ảnh có đuôi `.jpeg` hoặc `.png`",
            });

            return;
        }

        await goji.updateOne({
            avatarURL: avatar.url,
        });

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Đã update ảnh thành công cho Goji **${goji.name}**`)
                    .setImage(avatar.url)
                    .setColor(config.colors.default),
            ],
        });
    }

    public override async executeAutocomplete(interaction: Command.Autocomplete) {
        const focused = interaction.options.getFocused(true);

        if (focused.name === "name") {
            const gojis = await Goji.find({
                authorId: interaction.user.id,
                guildId: interaction.guildId,
            });

            const results = gojis.filter(
                (g) => g.name.toUpperCase().search(focused.value.toUpperCase()) !== -1
            );

            await interaction.respond(results.map((r) => ({ name: r.name, value: r.name })));
        }
    }
}
