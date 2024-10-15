import { model, Schema } from "mongoose";

export default model(
    "temp-voice",
    new Schema({
        channelId: { type: String, required: true },
        guildId: { type: String, required: true },
        ownerId: { type: String, required: true },
    })
);
