import SendMsg, { CmdStatus } from "../utils/sendMsg";
import { Client, Message } from "discord.js";

export default class CmdChannel {
  public static printCmdChannel(bot: Client, msg: Message) {
    SendMsg.cmdRes(bot, msg, CmdStatus.SUCCESS, )
  }
}