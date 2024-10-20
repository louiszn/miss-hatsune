import type { Interaction } from "discord.js";
import Listener from "../Listener";

export default class extends Listener {
    public constructor() {
        super("interactionCreate");
    }

    public override async execute(interaction: Interaction) {
        if (!interaction.inCachedGuild()) {
            return;
        }

        const { client } = this;
        const { commands } = client;

        if (interaction.isCommand()) {
            const { commandName, commandType } = interaction;
            await commands.execute(commandName, commandType, interaction);
        }

        if (interaction.isAutocomplete()) {
            const { commandName, commandType } = interaction;
            const command = commands.get(commandName, commandType);
            await command?.executeAutocomplete?.(interaction);
        }
    }
}
