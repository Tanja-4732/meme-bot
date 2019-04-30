import {
  Message,
  DMChannel,
  MessageAttachment,
  Collection,
  TextChannel
} from "discord.js";
import SendMsg, { CmdStatus } from "../utils/sendMsg";
import GuildController from "../controllers/guildController";
import DmGuildLogic from "../utils/dmGuildLogic";
import { log, inspect } from "util";
import { getManager } from "typeorm";
import { GuildModel } from "../models/guildModel";

export default class Meme {
  static async postMeme(msg: Message): Promise<void> {
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

    log(inspect(dmChannel.lastMessage, null, 2));

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
    SendMsg.meme({
      attachment: attachments.first(),
      channel: memeChannel as TextChannel,
      msg
    });
  }

  static async disableMemeChannel(msg: Message): Promise<void> {
    try {
      await GuildController.disableMemeChannel(msg.guild);
      SendMsg.cmdRes({msg, status: CmdStatus.SUCCESS, text: "Disabled meme channel."})
    } catch (error) {
      
    }
  }

  static 
}
