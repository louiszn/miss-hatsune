import "@std/dotenv/load";
import {
    REST,
    Routes,
    APIVersion,
    type APIUser,
    type RESTPostAPIApplicationCommandsResult,
} from "npm:discord.js";

import config from "./config.ts";

import { getCommands } from "./utils/index.ts";

const applicationCommands = [];

for (const command of await getCommands()) {
    for (const data of command.applicationCommands) {
        applicationCommands.push(data);
    }
}

const rest = new REST({ version: APIVersion }).setToken(config.token);

const user = (await rest.get(Routes.user())) as APIUser;

const commands = (await rest.put(Routes.applicationCommands(user.id), {
    body: applicationCommands,
})) as RESTPostAPIApplicationCommandsResult[];

console.log(`Đã tải được ${commands.length} lệnh!`);
