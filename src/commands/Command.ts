import type {
    Awaitable,
    ChatInputCommandInteraction,
    Client,
    RESTPostAPIApplicationCommandsJSONBody as CommandData,
    Message,
} from "discord.js";

export default abstract class Command {
    public name: string;
    public applicationCommands: CommandData[];
    public client!: Client;

    public constructor(name: string, applicationCommands: CommandData[] = []) {
        this.name = name;
        this.applicationCommands = applicationCommands;
    }

    public init?(): Awaitable<void>;
    public executeChatInput?(interaction: ChatInputCommandInteraction): Awaitable<void>;
    public executeMessage?(message: Message<true>, ...args: string[]): Awaitable<void>;
}
