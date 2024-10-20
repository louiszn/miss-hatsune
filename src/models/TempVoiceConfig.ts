import { model, Schema } from "mongoose";

export default model(
    "temp-voice-config",
    new Schema({
        userId: { type: String, required: true },
        name: { type: String, required: false },
        lock: { type: Boolean, required: true },
        hide: { type: Boolean, required: true },
        whitelisted: { type: [String], required: true },
        blacklisted: { type: [String], required: true },
        managers: { type: [String], required: true },
    }),
);
