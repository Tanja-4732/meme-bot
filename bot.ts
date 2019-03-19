import { Client, Message } from "discord.js";
import { createConnection, ConnectionOptions } from "typeorm";
import { log } from "util";

import Events from "./middlewares/events";

/**
 * This is the main entry point for the application.
 *
 * It connects to a Postgres database, and the Discord API.
 */

// Startup message
log("Starting MemeBot");

const bot: Client = new Client();

export const prefix: string = process.env.MB_PREFIX || "mb";

// Register events
bot.on("message", (message: Message) => Events.message(bot, message));

// Connect to the database
createConnection({
  type: "postgres",
  host: process.env.MB_HOST,
  port: parseInt(process.env.MB_PORT, 10),
  username: process.env.MB_USER,
  password: process.env.MB_PWD,
  database: process.env.MB_DB,
  ssl: true,
  entities: [__dirname + "/models/*"],
  synchronize: process.env.MB_MODE !== "production" || true,
  logging: process.env.MB_LOG_DB === "3" ? true : ["error", "warn"],
  schema: process.env.MB_SCHEMA || "mb_dev"
} as ConnectionOptions)
  .then(() => {
    log("Connected to DB");
  })
  .catch((reason: any) => {
    log("DB connection failed:\n" + reason);
    process.exit(1);
  });

// Connect to Discord
bot
  .login(process.env.MB_TOKEN)
  .then(() => {
    log("Connected to Discord");
  })
  .catch((reason: any) => {
    log("Discord connection failed:\n" + reason);
    log(process.env.MB_TOKEN);
    process.exit(2);
  });
