import {
    PermissionFlagsBits,
    OverwriteType,
    type GuildChannelEditOptions,
    type OverwriteData,
} from "npm:discord.js";

import TempVoiceConfig from "../../models/TempVoiceConfig.ts";
import TempVoice from "../../models/TempVoice.ts";

import type Hatsune from "../../Hatsune.ts";

export default class TempVoiceManager {
    public client: Hatsune;

    public constructor(client: Hatsune) {
        this.client = client;
    }

    public async start() {
        await Promise.all([this.clearCreators(), this.clearTempVoices()]);
    }

    private async clearCreators() {
        const { client } = this;

        const tempVoices = await TempVoice.find();

        for (const tempVoice of tempVoices) {
            const channel = await client.channels
                .fetch(tempVoice.channelId)
                .catch(() => void 0);

            if (!channel) {
                await tempVoice.deleteOne();
            }
        }
    }

    private async clearTempVoices() {
        const { client } = this;

        const tempVoices = await TempVoice.find();

        for (const tempVoice of tempVoices) {
            const channel = await client.channels
                .fetch(tempVoice.channelId)
                .catch(() => void 0);

            if (!channel || !channel.isVoiceBased()) {
                await tempVoice.deleteOne();
                continue;
            }

            if (channel.members.size === 0) {
                await tempVoice.deleteOne();
                await channel.delete().catch(() => void 0);
            }
        }
    }

    public async getUserConfig(userId: string) {
        const user = await this.client.users.fetch(userId).catch(() => null);

        if (!user || user.bot) {
            return null;
        }

        let userConfig = await TempVoiceConfig.findOne({ userId });

        if (!userConfig) {
            userConfig = new TempVoiceConfig({ userId });
            await userConfig.save();
        }

        return userConfig;
    }

    public async getChannelData(
        userId: string,
        guildId: string,
    ): Promise<GuildChannelEditOptions | null> {
        const userConfig = await this.getUserConfig(userId);

        if (!userConfig) {
            return null;
        }

        const user = await this.client.users.fetch(userId);

        const permissionOverwrites: OverwriteData[] = [
            {
                id: userId,
                type: OverwriteType.Member,
                allow: [
                    PermissionFlagsBits.Connect,
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.SendMessages,
                ],
                deny: [],
            },
            {
                id: guildId, // @everyone
                type: OverwriteType.Role,
                allow: [],
                deny: [],
            },
        ];

        const everyone = permissionOverwrites[1];

        if (everyone.id !== guildId || !Array.isArray(everyone.deny)) {
            return null;
        }

        if (userConfig.lock) {
            everyone.deny.push(
                PermissionFlagsBits.Connect,
                PermissionFlagsBits.SendMessages,
            );
        }

        if (userConfig.hide) {
            everyone.deny.push(
                PermissionFlagsBits.ViewChannel,
            );
        }

        for (const managerId of userConfig.managers) {
            permissionOverwrites.push({
                id: managerId,
                type: OverwriteType.Member,
                allow: [
                    PermissionFlagsBits.Connect,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.ViewChannel,
                ],
            });
        }

        for (const whitelistedId of userConfig.whitelisted) {
            permissionOverwrites.push({
                id: whitelistedId,
                type: OverwriteType.Member,
                allow: [
                    PermissionFlagsBits.Connect,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.ViewChannel,
                ],
            });
        }

        for (const blacklistedId of userConfig.blacklisted) {
            permissionOverwrites.push({
                id: blacklistedId,
                type: OverwriteType.Member,
                deny: [
                    PermissionFlagsBits.Connect,
                    PermissionFlagsBits.SendMessages,
                ],
            });
        }

        return {
            name: userConfig.name || user.displayName,
            permissionOverwrites,
        };
    }
}
