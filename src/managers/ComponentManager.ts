import {
    Collection,
    MessageComponentInteraction,
    ModalSubmitInteraction,
    type Client,
} from "discord.js";
import type Component from "../components/Component";

export default class ComponentManager {
    public client: Client<true>;

    private components: Collection<string, Component>;

    public constructor(client: Client<true>) {
        this.client = client;
        this.components = new Collection();
    }

    public add(component: Component) {
        this.components.set(component.preCustomId, component);
    }

    public async execute(
        interaction:
            | MessageComponentInteraction<"cached">
            | ModalSubmitInteraction<"cached">,
    ) {
        const { customId } = interaction;
        const [preCustomId, ...args] = customId.split("|");
        const component = this.components.get(preCustomId);

        if (!component) {
            return;
        }

        if (interaction.isButton()) {
            await component.executeButton?.(interaction, args);
        }

        if (interaction.isStringSelectMenu()) {
            await component.executeStringSelectMenu?.(interaction, args);
        }

        if (interaction.isUserSelectMenu()) {
            await component.executeUserSelectMenu?.(interaction, args);
        }

        if (interaction.isRoleSelectMenu()) {
            await component.executeRoleSelectMenu?.(interaction, args);
        }

        if (interaction.isMentionableSelectMenu()) {
            await component.executeMentionableSlectMenu?.(interaction, args);
        }

        if (interaction.isModalSubmit()) {
            await component.executeModalSubmit?.(interaction, args);
        }
    }

    public async resetSelectMenuValues() {

    }
}
