import {
  Message,
  DMChannel,
  MessageAttachment,
  Collection,
  TextChannel,
  ReactionEmoji,
  User
} from "discord.js";
import SendMsg, { CmdStatus } from "../utils/sendMsg";
import GuildController from "../controllers/guildController";
import DmGuildLogic from "../utils/dmGuildLogic";
import { log, inspect } from "util";
import { getManager } from "typeorm";
import { GuildModel } from "../models/guildModel";
import ParseRef from "../utils/parseRef";

export default class Meme {
  /**
   * Handles memes to be posted
   *
   * @static
   * @param {Message} msg
   * @param {boolean} attribution If the username should be included
   * @returns {Promise<void>}
   * @memberof Meme
   */
  static async postMeme(msg: Message, attribution: boolean): Promise<void> {
    // TODO allow for multiple guilds #42
    const guildId: string = "557276089869664288";

    // Get guild to post in
    const guild = msg.client.guilds.find(guild => guild.id === guildId);
    const memeChannel = await GuildController.getMemeChannel(guild);

    // Check if memes are disabled
    if (memeChannel == null) {
      // Send error
      SendMsg.cmdRes({
        msg,
        status: CmdStatus.ERROR,
        text:
          "We couldn't post your meme for the guild you specified " +
          "doesn't allow for memes to be posted."
      });
      return;
    }

    // Get attachments
    const dmChannel: DMChannel = msg.channel as DMChannel;
    const attachments: Collection<
      string,
      MessageAttachment
    > = dmChannel.messages.last(2)[0].attachments;

    // log(inspect(dmChannel.lastMessage, null, 2));

    if (attachments.size != 1) {
      // Send error
      SendMsg.cmdRes({
        msg,
        status: CmdStatus.ERROR,
        text: "The previous message needs to contain exactly one attachment"
      });
      return;
    }

    // Post meme
    const meme = await SendMsg.meme({
      attachment: attachments.first(),
      channel: memeChannel as TextChannel,
      msg,
      attribution
    });

    await meme.react("👍");
    await meme.react("👎");

    const downvoteCollector = meme.createReactionCollector(
      (reaction: ReactionEmoji, user: User) => reaction.name === "👎"
    );

    // downvoteCollector.on("collect", ) // TODO #58
  }

  static async disableMemeChannel(msg: Message): Promise<void> {
    try {
      await GuildController.disableMemeChannel(msg.guild);
      SendMsg.cmdRes({
        msg,
        status: CmdStatus.SUCCESS,
        text: "We successfully disabled the meme channel."
      });
    } catch (error) {
      SendMsg.cmdRes({
        msg,
        status: CmdStatus.ERROR,
        text: "We couldn't disable the meme channel.\nThat's all we know."
      });
    }
  }

  static async setMemeChannel(
    msg: Message,
    memeChannelRef: string
  ): Promise<void> {
    try {
      const parsedRef = ParseRef.parseChannelRef(memeChannelRef);
      await GuildController.setMemeChannel(msg.guild, parsedRef);

      SendMsg.cmdRes({
        msg,
        status: CmdStatus.SUCCESS,
        text:
          "We've set the meme channel to #" +
          msg.guild.channels.find(channel => channel.id === parsedRef).name
      });
    } catch (error) {
      SendMsg.cmdRes({
        msg,
        status: CmdStatus.ERROR,
        text: "We couldn't set the meme channel.\nThat's all we know."
      });
    }
  }

  static async printMemeChannel(msg: Message): Promise<void> {
    try {
      const memeChannel = await GuildController.getMemeChannel(msg.guild);
      SendMsg.cmdRes({
        msg,
        status: CmdStatus.INFO,
        text:
          "The meme channel is " +
          (memeChannel == null ? "disabled." : "set to #" + memeChannel.name)
      });
    } catch (error) {
      SendMsg.cmdRes({
        msg,
        status: CmdStatus.ERROR,
        text: "We couldn't print the meme channel.\nThat's all we know."
      });
    }
  }
}
