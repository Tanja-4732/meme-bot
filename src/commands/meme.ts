import { Message, DMChannel, MessageAttachment, Collection, TextChannel } from "discord.js";
import SendMsg, { CmdStatus } from "../utils/sendMsg";
import GuildController from "../controllers/guildController";

export default class Meme {
  static postMeme(msg: Message): void {
    // TODO allow for multiple guilds #42
    const guildId: string = "557276089869664288";

    const guild = msg.client.guilds.find(guild => guild.id === guildId);
    const memeChannelId = GuildController.
    const channel: TextChannel = guild.channels.find(ch => ch.id === "SomethinHere");

    const dmChannel: DMChannel = msg.channel as DMChannel;
    const attachments: Collection<string, MessageAttachment> =
      dmChannel.lastMessage.attachments;

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
    SendMsg.meme({ attachment: attachments[0], channel:  });
  }
}
