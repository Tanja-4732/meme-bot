import cmd from "./commands/cmd";
import { log } from "util";
import { Client, Collection, Message } from "discord.js";
import { readdirSync } from "fs";
import Init from "./commands/controllers/init";

const bot: Client = new Client();

const prefix: string = process.env.MB_PREFIX || "mb";

// Register events
bot.on("message", (message: Message) => Init.init(bot, message));

// Connect to Discord
log("Logging in with token: " + process.env.MB_TOKEN);
try {
  bot.login(process.env.MB_TOKEN);
} catch (error) {
  log("Couldn't log in:\n" + error);
  process.exit(1);
}