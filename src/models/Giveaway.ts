import { model, Schema } from "mongoose";

export default model(
    "giveaway",
    new Schema({
        guildId: { type: String, required: true },
        channelId: { type: String, required: true },
        messageId: { type: String, required: true },
        prize: { type: String, required: true },
        authorId: { type: String, required: true },
        winnerCount: { type: Number, default: 1 },
        users: { type: [String], default: [] },
        // winners: { type: [String], default: [] },
        expireAt: { type: Date, required: true },
        ended: { type: Boolean, default: false },
    }),
);
