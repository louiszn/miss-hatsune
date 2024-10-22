import { Collection, Routes, type Message } from "npm:discord.js";
import { sleep } from "../../utils/index.ts";

import Listener from "../Listener.ts";
import Sticky from "../../models/Sticky.ts";

const cooldowns = new Collection<string, number>();
const queue = new Set<string>();

// TODO: Chuyển sang dùng Redis EXP

export default class extends Listener {
    public constructor() {
        super("messageCreate");
    }

    public override async execute(message: Message<true>) {
        const { guildId, channelId, channel } = message;
        const { client } = this;

        if (!guildId) {
            return;
        }

        if (queue.has(channelId)) {
            return;
        }

        queue.add(channelId);

        if (cooldowns.has(channelId)) {
            const duration = cooldowns.get(channelId)! - Date.now();
            await sleep(duration);
        }

        const baseDuration = 5_000;
        cooldowns.set(channelId, Date.now() + baseDuration);
        setTimeout(() => cooldowns.delete(channelId), baseDuration);

        const sticky = await Sticky.findOne({
            guildId,
            channelId,
        });

        if (!sticky || message.id === sticky.oldMessageId) {
            queue.delete(channelId);
            return;
        }

        await client.rest
            .delete(Routes.channelMessage(channelId, sticky.oldMessageId))
            .catch(() => null);

        const newMessage = await channel.send({
            content: sticky.content,
        });

        await sticky.updateOne({ oldMessageId: newMessage.id });

        queue.delete(channelId);
    }
}
