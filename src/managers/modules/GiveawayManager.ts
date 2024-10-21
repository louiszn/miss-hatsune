import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Collection,
    EmbedBuilder,
    type Client,
} from "discord.js";

import { CronJob } from "cron";

import Giveaway from "../../models/Giveaway";
import GiveawayComponent from "../../components/modules/Giveaway";

export default class GiveawayManager {
    public client: Client<true>;

    public jobs: Collection<string, CronJob>;

    public constructor(client: Client<true>) {
        this.client = client;
        this.jobs = new Collection();
    }

    public async get(channelId: string, messageId: string, ended = false) {
        const giveaway = await Giveaway.findOne({
            channelId,
            messageId,
            ended,
        });

        return giveaway;
    }

    public async getAll(guildId?: string, channelId?: string, ended = false) {
        const conditions: any = { ended };

        if (guildId) {
            conditions.guildId = guildId;
        }

        if (channelId) {
            conditions.channelId = channelId;
        }

        const giveaways = await Giveaway.find(conditions);

        return giveaways;
    }

    public async start() {
        const giveaways = await this.getAll();

        for (const giveaway of giveaways) {
            const { expireAt, messageId, channelId } = giveaway;

            if (!(expireAt instanceof Date)) {
                await giveaway.deleteOne();
                continue;
            }

            if (Date.now() >= expireAt.getTime()) {
                await this.end(channelId, messageId);
                continue;
            }

            this.createJob(
                channelId,
                messageId,
                expireAt,
            );
        }
    }

    public async passUser(
        channelId: string,
        messageId: string,
        userId: string,
    ) {
        const giveaway = await this.get(channelId, messageId);

        let status = -1;

        if (!giveaway) {
            return [status, 0];
        }

        const uI = giveaway.users.indexOf(userId);

        if (uI !== -1) {
            giveaway.users.splice(uI, 1);
            status = 0;
        } else {
            giveaway.users.push(userId);
            status = 1;
        }

        await giveaway.updateOne({ users: giveaway.users });

        return [status, giveaway.users.length];
    }

    public async create(
        guildId: string,
        channelId: string,
        authorId: string,
        prize: string,
        winnerCount: number,
        expireAt: Date,
    ) {
        const { config, user } = this.client;

        const channel = await this.client.channels.fetch(channelId);

        if (!channel || !channel.isSendable()) {
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle("🎉 Giveaway đang bắt đầu 🎉")
            .setDescription(`## ${prize}`)
            .setFields({
                name: "Thông tin:",
                value: `- **Tạo bởi:** <@${authorId}>\n- **Số người thắng:** ${winnerCount}\n- **Kết thúc lúc:** <t:${Math.floor(expireAt.getTime() / 1000)}:R>`,
            })
            .setTimestamp()
            .setThumbnail(
                "https://media.discordapp.net/attachments/1283801275800092786/1297941234777854054/1743305.png?ex=6717c178&is=67166ff8&hm=761bb5e2792986a3dfc07915655e1f542ce0e1d26a92339611c23fd50ea2b84d&=&format=webp&quality=lossless&width=460&height=460",
            )
            .setColor(config.colors.default);

        const message = await channel.send({
            embeds: [embed],
            components: [
                new ActionRowBuilder<any>().setComponents(
                    GiveawayComponent.joinButton(),
                ),
            ],
        });

        const giveaway = new Giveaway({
            guildId,
            channelId,
            messageId: message.id,
            authorId,
            prize,
            winnerCount,
            expireAt,
        });

        await giveaway.save();

        this.createJob(channel.id, message.id, expireAt);
    }

    public async end(channelId: string, messageId: string) {
        const giveaway = await this.get(channelId, messageId);

        if (!giveaway) {
            return;
        }

        const channel = await this.client.channels
            .fetch(channelId)
            .catch(() => null);

        if (!channel || !channel.isSendable()) {
            return;
        }

        const message = await channel.messages
            .fetch(messageId)
            .catch(() => null);

        if (!message) {
            return;
        }

        await giveaway.updateOne({ ended: true });

        let winners = giveaway.users.sort(() => 0.5 - Math.random());
        winners = winners.slice(
            0,
            Math.min(giveaway.winnerCount, winners.length),
        );

        const mentionedWinners = winners.map((w) => `<@${w}>`);

        const embed = new EmbedBuilder(message.embeds[0].data)
            .setTitle("🎊 Giveaway đã kết thúc 🎊")
            .addFields({
                name: "Người thắng:",
                value: mentionedWinners.join(", ") || "Không có ai tham gia",
            })
            .setColor(0x7fa1c3);

        await message.edit({
            embeds: [embed],
            components: [
                new ActionRowBuilder<any>().setComponents(
                    GiveawayComponent.joinButton(false, giveaway.users.length),
                ),
            ],
        });

        let content = "";

        if (winners.length) {
            content = `Chúc mừng ${mentionedWinners.join(", ")} đã thắng giải **${giveaway.prize}**!`;
        } else {
            content = "Giveaway đã kết thúc, nhưng chẳng có ai tham gia cả...";
        }

        const row = new ActionRowBuilder<ButtonBuilder>().setComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel("Đi tới giveaway")
                .setEmoji("🎉")
                .setURL(message.url),
        );

        await message.reply({
            content,
            components: [row],
        });
    }

    public createJob(channelId: string, messageId: string, expireAt: Date) {
        const job = new CronJob(expireAt, () => {
            this.end(channelId, messageId);
            this.deleteJob(channelId, messageId);
        });

        this.jobs.set(`${channelId}:${messageId}`, job);

        job.start();
    }

    public deleteJob(channelId: string, messageId: string) {
        const job = this.jobs.get(`${channelId}:${messageId}`);

        if (job) {
            job.stop();
        }

        this.jobs.delete(`${channelId}:${messageId}`);
    }
}
