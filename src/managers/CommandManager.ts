import {
    Collection,
    ApplicationCommandType,
    EmbedBuilder,
    type CommandInteraction,
} from "npm:discord.js";

import type Hatsune from "../Hatsune.ts";

import { sleep } from "../utils/index.ts";

import type Command from "../commands/Command.ts";
import type { SubcommandData } from "../types/subcommand.ts";

interface SubcommandCollectionValue {
    commandName: string;
    data: SubcommandData;
}

export default class CommandManager {
    public client: Hatsune<true>;

    private commands: Collection<string, Command>;

    private chatInputs: Collection<string, string>;
    private userContextMenus: Collection<string, string>;
    private messageContextMenus: Collection<string, string>;

    private subcommands: Collection<string, SubcommandCollectionValue>;

    public constructor(client: Hatsune<true>) {
        this.client = client;

        this.commands = new Collection();
        this.chatInputs = new Collection();
        this.userContextMenus = new Collection();
        this.messageContextMenus = new Collection();
        this.subcommands = new Collection();
    }

    public add(command: Command) {
        command.client = this.client;
        command.init?.();
        this.commands.set(command.name, command);

        for (const data of command.applicationCommands) {
            if (data.type === ApplicationCommandType.Message) {
                this.messageContextMenus.set(data.name, command.name);
            } else if (data.type === ApplicationCommandType.User) {
                this.userContextMenus.set(data.name, command.name);
            } else {
                this.chatInputs.set(data.name, command.name);
            }
        }

        for (const k of Object.keys(command.subcommands)) {
            for (const data of command.subcommands[k]) {
                if ("subcommands" in data) {
                    for (const subcommand of data.subcommands) {
                        this.subcommands.set(
                            `${k}:${data.name}:${subcommand.name}`,
                            {
                                commandName: k,
                                data: subcommand,
                            }
                        );
                    }
                } else {
                    this.subcommands.set(`${k}:${data.name}`, {
                        commandName: k,
                        data,
                    });
                }
            }
        }
    }

    public get(name: string, type: ApplicationCommandType) {
        let baseName: string | undefined;

        if (type === ApplicationCommandType.Message) {
            baseName = this.messageContextMenus.get(name);
        } else if (type === ApplicationCommandType.User) {
            baseName = this.userContextMenus.get(name);
        } else {
            baseName = this.chatInputs.get(name);
        }

        return this.commands.get(baseName!);
    }

    public async execute(
        name: string,
        type: ApplicationCommandType,
        interaction: CommandInteraction<"cached">
    ) {
        const { member, user } = interaction;
        const { redis, config } = this.client;

        const command = this.get(name, type);

        if (!command) {
            return;
        }

        const cooldownKey = `${command.name}:${user.id}`;

        if ((await redis.get(cooldownKey)) !== null) {
            const expire = await redis.expiretime(cooldownKey);

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `⏰ Cậu phải chờ <t:${expire}:R> nữa mới có thể dùng tiếp lệnh này!`
                        )
                        .setColor(config.colors.error),
                ],
                ephemeral: true,
            });

            await sleep(expire * 1000 - Date.now());

            await interaction.deleteReply().catch(() => void 0);

            return;
        }

        await redis.set(cooldownKey, "", "EX", command.cooldown / 1000);

        if (
            command.permissions &&
            !member.permissions.has(command.permissions, true)
        ) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            "❌ Cậu không có quyền để dùng lệnh này :P"
                        )
                        .setColor(config.colors.error),
                ],
                ephemeral: true,
            });

            return;
        }

        if (interaction.isChatInputCommand()) {
            await command.executeChatInput?.(interaction);
            await this.handleSubcommand(command, interaction);
        }

        if (interaction.isUserContextMenuCommand()) {
            await command.executeUserContextMenu?.(interaction);
        }

        if (interaction.isMessageContextMenuCommand()) {
            await command.executeMessageContextMenu?.(interaction);
        }
    }

    public async handleSubcommand(
        command: Command,
        interaction: Command.ChatInput
    ) {
        const { commandName, options, member } = interaction;
        const { client } = this;

        const _subcommand = options.getSubcommand(false);
        const _subcommandGroup = options.getSubcommandGroup(false);

        if (!_subcommand) {
            return;
        }

        let subcommand: SubcommandCollectionValue | undefined;

        if (_subcommandGroup) {
            subcommand = this.subcommands.get(
                `${commandName}:${_subcommandGroup}:${_subcommand}`
            );
        } else {
            subcommand = this.subcommands.get(`${commandName}:${_subcommand}`);
        }

        if (!subcommand) {
            return;
        }

        if (
            subcommand.data.permissions &&
            !member.permissions.has(subcommand.data.permissions, true)
        ) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            "❌ Cậu không có quyền để dùng lệnh này :P"
                        )
                        .setColor(client.config.colors.error),
                ],
                ephemeral: true,
            });

            return;
        }

        // deno-lint-ignore no-explicit-any
        await (command as any)[`_${subcommand.data.target}`]?.(interaction);
    }
}
