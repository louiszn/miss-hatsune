import { model, Schema } from "npm:mongoose";

export default model(
    "goji-message",
    new Schema({
        guildId: { type: String, required: true },
        messageId: { type: String, required: true },
        channelId: { type: String, required: true },
        authorId: { type: String, required: true },
    }),
);
