import Listener from "../../Listener";
import TempVoice from "../../../models/TempVoice";

/**
 * Dọn dẹp các kênh thoại không sử dụng
 */
export default class extends Listener {
    public constructor() {
        super("ready", true);
    }

    public override async execute() {
        this.clearCreators();
        this.clearTempVoices();
    }

    private async clearCreators() {
        const { client } = this;

        const tempVoices = await TempVoice.find();

        for (const tempVoice of tempVoices) {
            const channel = await client.channels.fetch(tempVoice.channelId).catch(() => void 0);

            if (!channel) {
                await tempVoice.deleteOne();
            }
        }
    }

    private async clearTempVoices() {
        const { client } = this;

        const tempVoices = await TempVoice.find();

        for (const tempVoice of tempVoices) {
            const channel = await client.channels.fetch(tempVoice.channelId).catch(() => void 0);

            if (!channel || !channel.isVoiceBased()) {
                await tempVoice.deleteOne();
                continue;
            }

            if (channel.members.size === 0) {
                await tempVoice.deleteOne();
                await channel.delete().catch(() => void 0);
            }
        }
    }
}
