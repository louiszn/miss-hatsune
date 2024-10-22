import { type GuildMember } from "npm:discord.js";
import Listener from "../Listener.ts";

export default class extends Listener {
    public constructor() {
        super("guildMemberUpdate");
    }

    public override async execute(
        _oldMember: GuildMember,
        newMember: GuildMember
    ) {
        if (
            !newMember.flags.has("CompletedOnboarding") ||
            !newMember.flags.has("BypassesVerification") ||
            newMember.pending
        ) {
            return;
        }

        const { guild } = newMember;

        const role = await guild.roles.fetch("1292102284599361666");

        if (!role) {
            return;
        }

        await newMember.roles.add(role);
    }
}
