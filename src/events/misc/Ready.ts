import { ActivityType } from "npm:discord.js";
import Listener from "../Listener.ts";

export default class Ready extends Listener {
    public constructor() {
        super("ready", true);
    }

    public override execute() {
        const { client } = this;
        
        console.log(`Đã đăng nhập tại ${client.user.tag}`);

        client.user.setPresence({
            status: "dnd",
            activities: [
                {
                    name: " ",
                    state: "👻 Peeka Boo!",
                    type: ActivityType.Custom,
                }
            ]
        });
    }
}
