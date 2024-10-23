# Miss Hatsune
Miss Hatsune is a Discord bot, written on top of [Deno](https://github.com/denoland/deno) runtime with TypeScript and using [discord.js](https://github.com/discordjs/discord.js/).\
\
The bot is developed specifically for ZentSchool server with love<3.

# Requirements
- Deno >= `v2.0`
- MongoDB
- Redis

# Installation
## **Step 1** - Clone the repository:
```
git clone https://github.com/louiszn/miss-hatsune
cd miss-hatsune
```

## **Step 2** - Install dependencies
```
deno install
```

## **Step 3** - Config your `.env` file
Copy from example env file
```
cp .env.example .env
```

Add value for each env key
- `BOT_TOKEN`: Token of your Discord bot
- `MONGO_URI`: Your MongoDB connection URI
- `REDIS_URI`: Your Redis connection URI
- `PROCESS_ENV`: Use `development` or `production`

## **Step 4** - Config `src/config.ts`
This file is used to config default values which the bot will use. Make it easier to config by using objects. The file is located in `src/config.ts`

## **Step 5** - Run the bot!
Register application commands *(Only run this when you need to register commands. Mostly you will only use it once)*
```
deno task deloy
```

Run the bot
```
deno task start
```

# Contribution
All of your contributions are welcome :D. Please make sure you have checked the issues/pull requests for the related content that you want me to do.
