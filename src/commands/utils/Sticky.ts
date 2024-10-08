import { PermissionFlagsBits, Routes, SlashCommandBuilder } from "discord.js";
import Command from "../Command";
import Sticky from "../../models/Sticky";

export default class StickyMessage extends Command {
    public constructor() {
        super("sticky", [
            new SlashCommandBuilder()
                .setName("sticky")
                .setDescription("Module Sticky.")
                .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("enable")
                        .setDescription("Bật Sticky Message cho kênh hiện tại")
                        .addStringOption((option) =>
                            option
                                .setName("content")
                                .setDescription("Nội dung của Sticky Message")
                                .setRequired(true)
                                .setMaxLength(1024)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("disable")
                        .setDescription("Tắt Sticky Message cho kênh hiện tại")
                        .addBooleanOption((option) =>
                            option.setName("clear").setDescription("Xoá sticky message")
                        )
                )
                .toJSON(),
        ]);
    }

    public override async executeChatInput(interaction: Command.ChatInput) {
        const choice = "_" + interaction.options.getSubcommand();
        (this as any)[choice](interaction);
    }

    protected async _enable(interaction: Command.ChatInput) {
        const { guildId, channelId, options } = interaction;

        const content = options.getString("content", true);

        const existed = await Sticky.findOne({
            guildId,
            channelId,
        });

        if (existed) {
            await existed.updateOne({ content });
            return;
        }

        await new Sticky({
            guildId,
            channelId,
            content,
            oldMessageId: "_",
        }).save();

        await interaction.reply({
            content: "Đã bật Sticky Message!",
        });
    }

    protected async _disable(interaction: Command.ChatInput) {
        const { guildId, channelId, client, options } = interaction;

        const clear = options.getBoolean("clear");

        const sticky = await Sticky.findOne({
            guildId,
            channelId,
        });

        if (!sticky) {
            await interaction.reply({
                content: "Kênh này không có Sticky Message!",
            });

            return;
        }

        await sticky.deleteOne();

        if (clear) {
            await client.rest
                .delete(Routes.channelMessage(channelId, sticky.oldMessageId))
                .catch(() => null);
        }

        await interaction.reply("Đã tắt Sticky Message!");
    }
}
