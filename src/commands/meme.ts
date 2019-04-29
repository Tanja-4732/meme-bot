import { Message, DMChannel } from "discord.js";
import SendMsg, { CmdStatus } from "../utils/sendMsg";

export default class Meme {
  static postMeme(msg: Message): void {
    const dmChannel: DMChannel = msg.channel as DMChannel;
    const attachments = dmChannel.lastMessage.attachments;

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
    SendMsg.meme({ channel: {} })
  }
}
