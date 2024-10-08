import type {
    Awaitable,
    ChatInputCommandInteraction,
    MessageContextMenuCommandInteraction,
    Client,
    RESTPostAPIApplicationCommandsJSONBody as CommandData,
    UserContextMenuCommandInteraction
} from "discord.js";

namespace Command {
    export type ChatInput = ChatInputCommandInteraction;
    export type UserContextMenu = UserContextMenuCommandInteraction;
    export type MessageContentMenu = MessageContextMenuCommandInteraction;
}

abstract class Command {
    public name: string;
    public applicationCommands: CommandData[];
    public client!: Client;
    public cooldown = 5000;

    public constructor(name: string, applicationCommands: CommandData[] = []) {
        this.name = name;
        this.applicationCommands = applicationCommands;
    }

    public init?(): Awaitable<void>;
    public executeChatInput?(interaction: Command.ChatInput): Awaitable<void>;
    public executeUserContextMenu?(interaction: Command.UserContextMenu): Awaitable<void>;
    public executeMessageContextMenu?(interaction: Command.MessageContentMenu): Awaitable<void>;
}

export default Command;
