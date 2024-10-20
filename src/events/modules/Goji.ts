import type { Message, TextChannel } from "discord.js";
import Listener from "../Listener";
import Goji from "../../models/Goji";
import GojiMessage from "../../models/GojiMessage";

export default class extends Listener {
    public constructor() {
        super("messageCreate");
    }

    public override async execute(message: Message<true>) {
        const { guildId, author, channel, client } = message;

        if (!guildId) {
            return;
        }

        const gojis = await Goji.find({ authorId: author.id, guildId });
        const goji = gojis.find(
            (g) => g.prefix && message.content.startsWith(g.prefix),
        );

        if (!goji || !goji.prefix) {
            return;
        }

        await message.delete().catch(() => void 0);

        let webhook = (await (channel as TextChannel).fetchWebhooks()).find(
            (w) => w.owner?.id === client.user.id && w.name === "GojiHook",
        );

        if (!webhook) {
            webhook = await (channel as TextChannel).createWebhook({
                name: "GojiHook",
                avatar: client.user.displayAvatarURL(),
            });
        }

        let content = "";

        if (message.reference?.messageId) {
            const submark = `-# ╭┈`;

            const repliedMessage = await channel.messages
                .fetch(message.reference.messageId)
                .catch(() => void 0);

            if (repliedMessage) {
                let orgContent = repliedMessage.content;

                if (repliedMessage.webhookId) {
                    const splitted = orgContent.split("\n");

                    if (splitted[0].startsWith(submark)) {
                        orgContent = splitted.slice(1).join("\n");
                    }
                }

                let displayContent = orgContent.slice(0, 43);

                if (displayContent.length < orgContent.length) {
                    displayContent += "...";
                }

                content += `${submark} **${repliedMessage.author.username}** - ${displayContent} [Nhảy tới tin nhắn](${repliedMessage.url})\n`;
            }
        }

        content += message.content.slice(goji.prefix.length).trim();

        const gMessage = await webhook.send({
            username: goji.name,
            avatarURL: goji.avatarURL || void 0,
            content,
        });

        await new GojiMessage({
            guildId,
            messageId: gMessage.id,
            channelId: channel.id,
            authorId: author.id,
        }).save();
    }
}
