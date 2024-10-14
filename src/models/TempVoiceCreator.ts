import { model, Schema } from "mongoose";

const schema = new Schema({
    guildId: { type: String, required: true },
    channelId: { type: String, required: true },
});

export default model("temp-voice-creator", schema);
