import { Routes, type Message } from "discord.js";
import Command from "../Command";
import Sticky from "../../models/Sticky";

export default class StickyMessage extends Command {
    public constructor() {
        super("sticky");
    }

    public override async executeMessage(
        message: Message<true>,
        choice: "enable" | "disable",
        ...args: string[]
    ) {
        if (choice !== "enable" && choice !== "disable") {
            return;
        }

        await this[choice](message, args.join(" "));
    }

    private async enable(message: Message<true>, content: string) {
        if (!content) {
            return;
        }

        const { channel, guildId, channelId } = message;

        const existed = await Sticky.findOne({
            guildId,
            channelId,
        });

        if (existed) {
            await existed.updateOne({ content });
            return;
        }

        await message.channel.send("Đã bật Sticky Message!");

        const base = await channel.send({
            content,
        });

        await new Sticky({
            guildId,
            channelId,
            content,
            oldMessageId: base.id,
        }).save();
    }

    private async disable(message: Message<true>) {
        const { channel, guildId, channelId } = message;

        const sticky = await Sticky.findOne({
            guildId,
            channelId,
        });

        if (!sticky) {
            return;
        }

        await sticky.deleteOne();

        await message.client.rest
            .delete(Routes.channelMessage(channelId, sticky.oldMessageId))
            .catch(() => null);

        await message.channel.send("Đã tắt Sticky Message!");
    }
}
