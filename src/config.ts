const { env } = Deno;

export default {
    token: env.get("BOT_TOKEN")!,
    mongoURI: env.get("MONGO_URI")!,
    redisURI: env.get("REDIS_URI")!,
    colors: {
        default: 0xfeff9f,
        error: 0xf95454,
    },
};
