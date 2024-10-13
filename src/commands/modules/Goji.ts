import { SlashCommandBuilder } from "discord.js";
import Command from "../Command";

export default class Goji extends Command {
    public constructor() {
        super("Zant");

        this.applicationCommands.push(
            new SlashCommandBuilder()
                .setName("goji")
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

        this.subcommands["goji"] = [
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
