import { Schema, model } from "mongoose";

export default model(
    "goji",
    new Schema({
        name: { type: String, required: true },
        avatarURL: { type: String, required: false },
        authorId: { type: String, required: true },
        guildId: { type: String, required: true },
        prefix: { type: String, required: false },
    }),
);
