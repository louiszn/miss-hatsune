import type { Interaction } from "discord.js";
import Listener from "../Listener";

export default class CommandHandling extends Listener {
    public constructor() {
        super("interactionCreate");
    }

    public override async execute(interaction: Interaction) {
        if (!interaction.guild || !interaction.isCommand()) {
            return;
        }

        const { client, commandName } = interaction;

        const command = client.commands.find((c) =>
            c.applicationCommands.some((d) => d.name === commandName)
        );

        if (!command) {
            return;
        }

        if (interaction.isChatInputCommand()) {
            command.executeChatInput?.(interaction);
        }
    }
}
