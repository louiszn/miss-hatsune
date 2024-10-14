import { SlashCommandBuilder } from "discord.js";
import Command from "../Command";

export default class extends Command {
    public constructor() {
        super("goji");

        this.applicationCommands.push(
            new SlashCommandBuilder()
                .setName(this.name)
                .setDescription("Module Goji")
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("add")
                        .setDescription("Thêm Goji")
                        .addStringOption((option) =>
                            option
                                .setName("name")
                                .setDescription("Tên Goji")
                                .setRequired(true)
                                .setMaxLength(60)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("delete")
                        .setDescription("Xoá Goji")
                        .addStringOption((option) =>
                            option
                                .setName("name")
                                .setDescription("Tên Goji để xoá")
                                .setRequired(true)
                                .setMaxLength(60)
                                .setAutocomplete(true)
                        )
                )
                .toJSON()
        );

        this.subcommands[this.name] = [
            {
                name: "add",
                target: "add",
            },
            {
                name: "delete",
                target: "delete",
            },
        ];
    }
}
