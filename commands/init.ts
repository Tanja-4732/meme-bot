import { log } from "util";
import { Client, Message } from "discord.js";

export default class Init {
  public static init(bot: Client, msg: Message): void {
    log("Init...");
    log("init done.");
  }
}
