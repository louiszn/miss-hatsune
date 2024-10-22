import type { Interaction } from "npm:discord.js";
import Listener from "../Listener.ts";

export default class extends Listener {
    public constructor() {
        super("interactionCreate");
    }

    public override async execute(interaction: Interaction) {
        if (!interaction.inCachedGuild()) {
            return;
        }

        const { client } = this;
        const { commands, components } = client;

        if (interaction.isCommand()) {
            const { commandName, commandType } = interaction;
            await commands.execute(commandName, commandType, interaction);
        }

        if (interaction.isAutocomplete()) {
            const { commandName, commandType } = interaction;
            const command = commands.get(commandName, commandType);
            await command?.executeAutocomplete?.(interaction);
        }

        if (interaction.isMessageComponent() || interaction.isModalSubmit()) {
            await components.execute(interaction);
        }
    }
}
