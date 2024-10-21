import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
} from "discord.js";
import Component from "../Component";

export default class Giveaway extends Component {
    static joinButton(disabled = false, amount = 0) {
        return new ButtonBuilder()
            .setCustomId(`giveaway|join`)
            .setLabel(`Tham gia (${amount})`)
            .setEmoji("🎉")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(disabled);
    }

    public constructor() {
        super("giveaway");
    }

    public override async executeButton(
        interaction: Component.Button,
        args: string[],
    ) {
        const { channelId, client, message, user } = interaction;
        const { modules, config } = client;

        const [choice] = args;

        switch (choice) {
            case "join": {
                const [status, userCount] = await modules.giveaway.passUser(
                    channelId,
                    message.id,
                    user.id,
                );

                if (status === -1) {
                    await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(
                                    "❌ Giveaway này không có trong dữ liệu của tớ.",
                                )
                                .setColor(config.colors.error),
                        ],
                        ephemeral: true,
                    });

                    return;
                }

                if (status === 0) {
                    await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription("✅ Đã rời khỏi giveaway này!")
                                .setColor(config.colors.default),
                        ],
                        ephemeral: true,
                    });
                } else {
                    await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription("✅ Đã tham gia giveaway này!")
                                .setColor(config.colors.default),
                        ],
                        ephemeral: true,
                    });
                }

                await message.edit({
                    components: [
                        new ActionRowBuilder<any>().setComponents(
                            Giveaway.joinButton(false, userCount),
                        ),
                    ],
                });
            }
        }
    }
}
