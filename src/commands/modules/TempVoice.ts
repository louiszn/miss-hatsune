import { ChannelType, SlashCommandBuilder } from "discord.js";
import Command from "../Command";
// import TempVoice from "../../models/TempVoice";
import TempVoiceCreator from "../../models/TempVoiceCreator";

export default class extends Command {
    public constructor() {
        super("temp-voice");

        this.applicationCommands.push(
            new SlashCommandBuilder()
                .setName(this.name)
                .setDescription("Module temp voice")
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("setup")
                        .setDescription("Setup kênh dùng để tạo kênh mới")
                        .addChannelOption((option) =>
                            option
                                .setName("channel")
                                .setDescription("Kênh dùng để tạo")
                                .setRequired(false)
                                .addChannelTypes(ChannelType.GuildVoice)
                        )
                )
                .toJSON()
        );

        this.subcommands[this.name] = [
            {
                name: "setup",
                target: "setup",
            },
        ];
    }

    public async _setup(interaction: Command.ChatInput) {
        const { options, guild } = interaction;

        let channel = options.getChannel("channel", false, [ChannelType.GuildVoice]);

        if (channel) {
            const existed = await TempVoiceCreator.findOne({
                guildId: guild.id,
                channelId: channel.id,
            });

            if (existed) {
                await interaction.reply({
                    content: `Kênh ${channel} đã được đặt làm kênh khởi tạo từ trước rồi.`,
                });

                return;
            }
        } else {
            channel = await guild.channels.create({
                name: "Tạo kênh thoại",
                type: ChannelType.GuildVoice,
            });
        }

        await new TempVoiceCreator({
            guildId: guild.id,
            channelId: channel.id,
        }).save();

        await interaction.reply({
            content: `Đã đặt ${channel} làm kênh khởi tạo!`,
        });
    }
}
