import {
    PermissionFlagsBits,
    Routes,
    SlashCommandBuilder,
} from "npm:discord.js";

import Command from "../Command.ts";
import Sticky from "../../models/Sticky.ts";

export default class extends Command {
    public constructor() {
        super("sticky");

        this.applicationCommands.push(
            new SlashCommandBuilder()
                .setName(this.name)
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
                                .setMaxLength(1024),
                        ),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("disable")
                        .setDescription("Tắt Sticky Message cho kênh hiện tại")
                        .addBooleanOption((option) =>
                            option
                                .setName("clear")
                                .setDescription("Xoá sticky message"),
                        ),
                )
                .toJSON(),
        );

        this.subcommands[this.name] = [
            {
                name: "enable",
                target: "enable",
            },
            {
                name: "disable",
                target: "disable",
            },
        ];
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
