import { model, Schema } from "mongoose";

export default model(
    "temp-voice-config",
    new Schema({
        userId: { type: String, required: true },
        name: { type: String, required: false },
        lock: { type: Boolean, default: false },
        hide: { type: Boolean, default: false },
        whitelisted: { type: [String], default: [] },
        blacklisted: { type: [String], default: [] },
        managers: { type: [String], default: [] },
    }),
);
