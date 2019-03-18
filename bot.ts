import cmd from "./commands/cmd";
import { log } from "util";
import { Client, Collection } from "discord.js";
import { readdirSync } from "fs";

const bot: any = new Client();

bot.prefix = process.env.MB_PREFIX || "mb";
bot.commands = new Collection();

// const commandsDir: string[] = readdirSync("./commands");

// Register events
