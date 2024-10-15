import { model, Schema } from "mongoose";

export default model(
    "temp-voice-creator",
    new Schema({
        guildId: { type: String, required: true },
        channelId: { type: String, required: true },
    })
);
