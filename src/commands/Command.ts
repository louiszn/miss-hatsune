import type {
    Awaitable,
    ChatInputCommandInteraction,
    MessageContextMenuCommandInteraction,
    Client,
    RESTPostAPIApplicationCommandsJSONBody as CommandData,
    UserContextMenuCommandInteraction,
    AutocompleteInteraction
} from "discord.js";
import type { Subcommand } from "../types/subcommand";

namespace Command {
    export type ChatInput = ChatInputCommandInteraction;
    export type UserContextMenu = UserContextMenuCommandInteraction;
    export type MessageContentMenu = MessageContextMenuCommandInteraction;
    export type Autocomplete = AutocompleteInteraction;
}

abstract class Command {
    public name: string;
    public applicationCommands: CommandData[];
    public subcommands: { [x: string]: Subcommand[] };
    public client!: Client;
    public cooldown = 5000;

    public constructor(name: string) {
        this.name = name;
        this.applicationCommands = [];
        this.subcommands = {};
    }

    public init?(): Awaitable<void>;
    public executeChatInput?(interaction: Command.ChatInput): Awaitable<void>;
    public executeUserContextMenu?(interaction: Command.UserContextMenu): Awaitable<void>;
    public executeMessageContextMenu?(interaction: Command.MessageContentMenu): Awaitable<void>;
    public executeAutocomplete?(interaction: Command.Autocomplete): Awaitable<void>;
}

export default Command;
