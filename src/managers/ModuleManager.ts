import type { Client } from "discord.js";
import TempVoiceManager from "./modules/TempVoiceManager";
import GiveawayManager from "./modules/GiveawayManager";

export default class ModuleManager {
    public tempVoice: TempVoiceManager;
    public giveaway: GiveawayManager;

    public constructor(client: Client<true>) {
        this.tempVoice = new TempVoiceManager(client);
        this.giveaway = new GiveawayManager(client);
    }
}