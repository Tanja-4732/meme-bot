import {
  Client,
  Message,
  MessageReaction,
  User,
  Guild,
  GuildChannel,
  Collection,
  TextChannel
} from "discord.js";
import { log, inspect } from "util";
import Cmd from "./cmd";
import { prefix } from "../bot";
import Vote from "./vote";

/**
 * Contains all event-handling logic
 *
 * @export
 * @class Events
 */
export default class Events {
  /**
   * Handles message events
   *
   * @static
   * @returns {void}
   * @memberof Events
   */
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

  /**
   * Event handling of messageReactionAdd events
   *
   * @static
   * @param {Client} bot The client
   * @param {MessageReaction} messageReaction
   * @param {User} user
   * @memberof Events
   */
  static messageReactionAdd(
    bot: Client,
    messageReaction: MessageReaction,
    user: User
  ) {
    // Prevent self-activation
    if (user !== bot.user) Vote.useReaction(messageReaction, user);
  }

  static ready(bot: Client): void {
    log("Connected to Discord");

    const textChannels = bot.guilds
      // TODO Add support for other guilds
      .find(
        (guild: Guild): boolean => {
          return guild.id === "557276089869664288";
        }
      )

      // Only the text channels
      .channels.filter(
        (value: GuildChannel): boolean => {
          return value.type === "text";
        }
      );

    // Fetch all messages
    for (const cn of textChannels) {
      // Fetch all messages
      log((cn[1] as TextChannel).name);
    }
  }
}
