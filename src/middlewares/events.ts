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
import GuildController from "../controllers/guildController";
import MemeController from "../controllers/memeController";

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

  static async ready(bot: Client): Promise<void> {
    log("Connected to Discord");

    // Iterate over all initialized guilds
    for (const gm of await GuildController.getAllInitializedGuildModels()) {
      // Check if the guild has the meme channel enabled
      if (gm.memeChannelId != null) {
        // Get the meme channel
        const memeChannel = (bot.guilds
          .get(gm.id)
          .channels.get(gm.memeChannelId) as unknown) as TextChannel;

        // Iterate over all memes
        for (const mm of await MemeController.getAllMemesOfGuild(gm.id)) {
          // Fetch the meme
          memeChannel.fetchMessage(mm.messageId);

          // Fetch the video if one exists
          if (mm.videoMessageId != null)
            memeChannel.fetchMessage(mm.videoMessageId);
        }
      }
    }
  }
}
