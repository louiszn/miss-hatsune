import "@std/dotenv/load";
import Hatsune from "./Hatsune.ts";

const client = new Hatsune();
await client.init();
