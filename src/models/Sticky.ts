import { model, Schema } from "mongoose";

const schema = new Schema({
    guildId: { type: String, required: true },
    channelId: { type: String, required: true },
    content: { type: String, required: true },
    oldMessageId: { type: String, required: true },
});

export default model("sticky", schema);
