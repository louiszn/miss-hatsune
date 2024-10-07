import { model, Schema } from "mongoose";

const schema = new Schema({
    guildId: { type: String, required: true },
    channelId: { type: String, required: true },
    content: { type: String, required: true },
    oldMessageId: { type: String, required: true },
});

const Sticky = model("sticky", schema);

export default Sticky;
