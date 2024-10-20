import { BaseGuildVoiceChannel, Client, PermissionFlagsBits, VoiceChannel, type GuildChannelEditOptions, type OverwriteData } from "discord.js";
import TempVoiceConfig from "../../models/TempVoiceConfig";

export default class TempVoiceManager {
    public client: Client<true>;

    public constructor(client: Client<true>) {
        this.client = client;
    }

    public async getUserConfig(userId: string) {
        const user = await this.client.users.fetch(userId).catch(() => null);

        if (!user || user.bot) {
            return null;
        }

        let userConfig = await TempVoiceConfig.findOne({ userId });

        if (!userConfig) {
            userConfig = new TempVoiceConfig({
                userId,
                lock: false,
                hide: false,
                whitelisted: [],
                blacklisted: [],
                managers: [],
            });

            await userConfig.save();
        }

        return userConfig;
    }

    public async getChannelData(userId: string, guildId: string): Promise<GuildChannelEditOptions | null> {
        const userConfig = await this.getUserConfig(userId);

        if (!userConfig) {
            return null;
        }

        const user = await this.client.users.fetch(userId);

        const permissionOverwrites: OverwriteData[] = [
            {
                id: userId,
                allow: [
                    PermissionFlagsBits.Connect,
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.SendMessages,
                ],
                deny: [],
            },
            {
                id: guildId, // @everyone
                allow: [],
                deny: [],
            },
        ];

        if (userConfig.lock) {
            (permissionOverwrites[1].deny! as any[]).push(
                PermissionFlagsBits.Connect,
                PermissionFlagsBits.SendMessages,
            );
        }

        if (userConfig.hide) {
            (permissionOverwrites[1].deny! as any[]).push(
                PermissionFlagsBits.ViewChannel,
            );
        }

        for (const managerId of userConfig.managers) {
            permissionOverwrites.push({
                id: managerId,
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
