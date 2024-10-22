import { type GuildMember } from "npm:discord.js";
import Listener from "../Listener.ts";

export default class extends Listener {
    public constructor() {
        super("guildMemberUpdate");
    }

    public override async execute(member: GuildMember) {
        if (!member.flags.has("CompletedOnboarding") || !member.flags.has("BypassesVerification")) {
            return;
        }

        const { guild } = member;

        const role = await guild.roles.fetch("1292102284599361666");

        if (!role) {
            return;
        }

        await member.roles.add(role);
    }
}
