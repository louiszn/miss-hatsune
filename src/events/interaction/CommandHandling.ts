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

        const { client, commandName, commandType } = interaction;
        const { commands } = client;

        await commands.execute(commandName, commandType, interaction);
    }
}
