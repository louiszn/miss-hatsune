import type { Client } from "discord.js";
import TempVoiceManager from "./modules/TempVoiceManager";

export default class ModuleManager {
    public tempVoice: TempVoiceManager;

    public constructor(client: Client<true>) {
        this.tempVoice = new TempVoiceManager(client);
    }
}