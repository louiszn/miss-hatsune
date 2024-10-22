import {
    ChannelType,
    type GuildChannelCreateOptions,
    type VoiceState,
} from "npm:discord.js";

import Listener from "../Listener.ts";
import TempVoiceCreator from "../../models/TempVoiceCreator.ts";
import TempVoice from "../../models/TempVoice.ts";

import { sleep } from "../../utils/index.ts";

export default class extends Listener {
    public constructor() {
        super("voiceStateUpdate");
    }

    public override execute(oldState: VoiceState, newState: VoiceState) {
        if (newState.channel && oldState.channelId !== newState.channelId) {
            this.createVoiceChannel(newState);
        }

        if (oldState.channelId !== newState.channelId) {
            this.deleteVoiceChannel(oldState);
        }
    }

    private async createVoiceChannel(state: VoiceState) {
        const { member, channel, guild, client } = state;
        const { redis, modules } = client;

        const creator = await TempVoiceCreator.findOne({
            channelId: channel?.id,
            guildId: guild.id,
        });

        if (!creator || !member || !channel) {
            return;
        }

        const { user } = member;

        const cooldownKey = `vc_cooldown:${user.id}`;

        if ((await redis.get(cooldownKey)) !== null) {
            const expire = await redis.expiretime(cooldownKey);

            await member.voice.setChannel(null).catch(() => null);

            const msg = await user
                .send({
                    content: `Cậu phải chờ <t:${expire}:R> nữa mới có thể tạo kênh mới!`,
                })
                .catch(() => null);

            if (msg) {
                await sleep(expire * 1000 - Date.now());
                await msg.delete().catch(() => null);
            }

            return;
        }

        await redis.set(cooldownKey, "", "EX", 15);

        const tempChannel = await state.guild.channels.create({
            ...((await modules.tempVoice.getChannelData(
                user.id,
                guild.id
            )) as GuildChannelCreateOptions),
            type: ChannelType.GuildVoice,
            parent: channel.parent,
        });

        await new TempVoice({
            channelId: tempChannel.id,
            guildId: guild.id,
            ownerId: user.id,
        }).save();

        await member.voice.setChannel(tempChannel);
    }

    private async deleteVoiceChannel(state: VoiceState) {
        const { member, guild, channel } = state;

        if (!channel || !member) {
            return;
        }

        if (channel.members.size > 0) {
            return;
        }

        const tempVoice = await TempVoice.findOne({
            channelId: channel.id,
            guildId: guild.id,
        });

        if (!tempVoice) {
            return;
        }

        await tempVoice.deleteOne();
        await channel.delete();
    }
}
