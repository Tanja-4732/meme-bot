import { Client, Message, MessageReaction, User } from "discord.js";
import { log, inspect } from "util";
import Cmd from "./cmd";
import { prefix } from "../bot";

export default class Events {
  public static message({ bot, msg }: { bot: Client; msg: Message }): void {
    // Ignore bots own messages
    if (msg.author.id === bot.user.id) {
      // Avoid any further actions on own message
      return;
    }

    // Check if message is a command
    if (!msg.content.startsWith(prefix)) {
      // Abort command execution
      return;
    }

    // Check if the message was sent as a DM
    switch (msg.channel.type) {
      case "text":
        // Parse & execute message as guild command
        Cmd.useCmd(bot, msg);
        break;
      case "dm":
        Cmd.useDmCmd(bot, msg);
        break;
      case "group":
        Cmd.useGroupCmd(bot, msg);
        break;
    }
  }

  static messageReactionAdd(messageReaction: MessageReaction, user: User) {
    log(inspect(messageReaction));
  }
}
