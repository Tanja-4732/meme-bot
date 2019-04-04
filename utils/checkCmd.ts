import { Client, Message } from "discord.js";
import CmdChannel from "../commands/cmdChannel";
import SendMsg, { CmdStatus } from "./sendMsg";

export default class CheckCmd {
  public static async checkCmdChannelOrFail(
    bot: Client,
    msg: Message
  ): Promise<boolean> {
    return (await CmdChannel.getCmdChannel(bot, msg)).id === msg.channel.id;
  }
}
