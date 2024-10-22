import Listener from "../Listener.ts";

export default class extends Listener {
    public constructor() {
        super("ready");
    }

    public override execute() {
        const { client } = this;
        const { modules } = client;

        modules.giveaway.start();
        modules.tempVoice.start();
    }
}
