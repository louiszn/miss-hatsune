import type {
    Awaitable,
    ChatInputCommandInteraction,
    MessageContextMenuCommandInteraction,
    Client,
    RESTPostAPIApplicationCommandsJSONBody as CommandData,
    UserContextMenuCommandInteraction,
    AutocompleteInteraction,
    PermissionResolvable,
} from "npm:discord.js";
import type { Subcommand } from "../types/subcommand.ts";

// deno-lint-ignore no-namespace
namespace Command {
    export type ChatInput = ChatInputCommandInteraction<"cached">;
    export type UserContextMenu = UserContextMenuCommandInteraction<"cached">;
    export type MessageContentMenu =
        MessageContextMenuCommandInteraction<"cached">;
    export type Autocomplete = AutocompleteInteraction<"cached">;
}

abstract class Command {
    public name: string;
    public applicationCommands: CommandData[];
    public subcommands: { [x: string]: Subcommand[] };
    public client!: Client;
    public cooldown = 5000;
    public permissions?: PermissionResolvable;

    public constructor(name: string) {
        this.name = name;
        this.applicationCommands = [];
        this.subcommands = {};
    }

    public init?(): Awaitable<void>;

    public executeChatInput?(interaction: Command.ChatInput): Awaitable<void>;

    public executeUserContextMenu?(
        interaction: Command.UserContextMenu
    ): Awaitable<void>;

    public executeMessageContextMenu?(
        interaction: Command.MessageContentMenu
    ): Awaitable<void>;

    public executeAutocomplete?(
        interaction: Command.Autocomplete
    ): Awaitable<void>;
}

export default Command;
