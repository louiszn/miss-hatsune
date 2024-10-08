import { ApplicationCommandType, Client, Collection, CommandInteraction } from "discord.js";
import type Command from "../../commands/Command";
import { sleep } from "bun";

export default class CommandManager {
    public client: Client;

    private commands: Collection<string, Command>;
    private chatInputs: Collection<string, string>;
    private userContextMenus: Collection<string, string>;
    private messageContextMenus: Collection<string, string>;

    public constructor(client: Client) {
        this.client = client;

        this.commands = new Collection();
        this.chatInputs = new Collection();
        this.userContextMenus = new Collection();
        this.messageContextMenus = new Collection();
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
        interaction: CommandInteraction
    ) {
        const { client } = this;
        const { redis } = client;

        const command = this.get(name, type);

        if (!command) {
            return;
        }

        const cooldownKey = `${command.name}:${interaction.user.id}`;

        if (await redis.get(cooldownKey) !== null) {
            const expire = await redis.expiretime(cooldownKey);

            await interaction.reply({
                content: `Cậu phải chờ <t:${expire}:R> nữa mới có thể dùng tiếp lệnh này!`,
                ephemeral: true
            });

            await sleep(expire * 1000 - Date.now());

            await interaction.deleteReply().catch(() => void 0);

            return;
        }

        await redis.set(cooldownKey, ":3", "EX", command.cooldown / 1000);

        if (interaction.isChatInputCommand()) {
            await command.executeChatInput?.(interaction);
        }

        if (interaction.isUserContextMenuCommand()) {
            await command.executeUserContextMenu?.(interaction);
        }

        if (interaction.isMessageContextMenuCommand()) {
            await command.executeMessageContextMenu?.(interaction);
        }
    }

    public toArray() {
        return this.commands.map((c) => c.applicationCommands).flat();
    }
}
