import { Client, Message } from "discord.js";

export default class Events {
  public static message(bot: Client, msg: Message): void {
    msg.reply("Hello there!");
  }
}