import type { Message } from "discord.js";
import { Collection, Routes } from "discord.js";
import { sleep } from "bun";

import Listener from "../Listener";
import Sticky from "../../models/Sticky";

const cooldowns = new Collection<string, number>();
const queue = new Set<string>();

// TODO: Chuyển sang dùng Redis EXP

export default class extends Listener {
    public constructor() {
        super("messageCreate");
    }

    public override async execute(message: Message<true>) {
        const { guildId, channelId, channel } = message;

        if (!guildId) {
            return;
        }

        // ? Chặn spam request để tránh xung đột mỗi khi có tin nhắn mới

        // Dừng khi đang thực hiện một callback khác
        if (queue.has(channelId)) {
            return;
        }

        // Để các callback khác biết là callback này đang xử lý
        queue.add(channelId);

        // Cooldown 5s cho mỗi lần xoá để hạn chế bị rate limit
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

        // Khi bot gửi một tin nhắn mới thì cũng sẽ nhận một MessageCreate khác
        // Vì thế cần check xem tin nhắn vừa gửi có phải là Sticky không để không bị xung đột
        if (!sticky || message.id === sticky.oldMessageId) {
            queue.delete(channelId);
            return;
        }

        // Endpoint của message.delete cũng dùng phần này
        // Dùng luôn để bỏ qua được phần check tin nhắn
        await message.client.rest
            .delete(Routes.channelMessage(channelId, sticky.oldMessageId))
            .catch(() => null);

        const newMessage = await channel.send({
            content: sticky.content,
        });

        await sticky.updateOne({ oldMessageId: newMessage.id });

        // Xoá callback hiện tại khỏi hàng chờ để cho các callback sau thực hiện
        queue.delete(channelId);
    }
}
