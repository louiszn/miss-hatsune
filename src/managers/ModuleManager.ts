import type Hatsune from "../Hatsune.ts";

import TempVoiceManager from "./modules/TempVoiceManager.ts";
import GiveawayManager from "./modules/GiveawayManager.ts";

export default class ModuleManager {
    public tempVoice: TempVoiceManager;
    public giveaway: GiveawayManager;

    public constructor(client: Hatsune) {
        this.tempVoice = new TempVoiceManager(client);
        this.giveaway = new GiveawayManager(client);
    }
}