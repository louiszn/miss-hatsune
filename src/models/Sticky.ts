import { model, Schema } from "npm:mongoose";

export default model(
    "sticky",
    new Schema({
        guildId: { type: String, required: true },
        channelId: { type: String, required: true },
        content: { type: String, required: true },
        oldMessageId: { type: String, required: true },
    }),
);
