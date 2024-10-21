import type {
    Awaitable,
    ButtonInteraction,
    MentionableSelectMenuInteraction,
    RoleSelectMenuInteraction,
    StringSelectMenuInteraction,
    UserSelectMenuInteraction,
    ModalSubmitInteraction,
} from "discord.js";

namespace Component {
    export type Button = ButtonInteraction<"cached">;
    export type StringSelectMenu = StringSelectMenuInteraction<"cached">;
    export type UserSelectMenu = UserSelectMenuInteraction<"cached">;
    export type RoleSelectMenu = RoleSelectMenuInteraction<"cached">;
    export type MentionableSlectMenu =
        MentionableSelectMenuInteraction<"cached">;
    export type ModalSubmit = ModalSubmitInteraction<"cached">;
}

class Component {
    public preCustomId: string;

    public constructor(preCustomId: string) {
        this.preCustomId = preCustomId;
    }

    public executeButton?(
        interaction: Component.Button,
        args: string[],
    ): Awaitable<void>;

    public executeStringSelectMenu?(
        interaction: Component.StringSelectMenu,
        args: string[],
    ): Awaitable<void>;

    public executeUserSelectMenu?(
        interaction: Component.UserSelectMenu,
        args: string[]
    ): Awaitable<void>;

    public executeRoleSelectMenu?(
        interaction: Component.RoleSelectMenu,
        args: string[],
    ): Awaitable<void>;

    public executeMentionableSlectMenu?(
        interaction: Component.MentionableSlectMenu,
        args: string[],
    ): Awaitable<void>;

    public executeModalSubmit?(
        interaction: Component.ModalSubmit,
        args: string[],
    ): Awaitable<void>;
}

export default Component;
