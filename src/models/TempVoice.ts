import { model, Schema } from "mongoose";

const schema = new Schema({
    channelId: { type: String, required: true },
    guildId: { type: String, required: true },
    ownerId: { type: String, required: true },
});

export default model("temp-voice", schema);
