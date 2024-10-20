export default {
    token: process.env.BOT_TOKEN,
    mongoURI: process.env.MONGO_URI,
    redisURI: process.env.REDIS_URI,
    colors: {
        default: 0xfeff9f,
        error: 0xf95454,
    },
};
