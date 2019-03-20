import SendMsg, { CmdStatus } from "../utils/sendMsg";
import { Client, Message, GuildChannel } from "discord.js";
import GuildController from "../controllers/guildController";

export default class CmdChannel {
  public static async printCmdChannel(bot: Client, msg: Message) {
    let cmdChannel: GuildChannel;
    
    try {
     cmdChannel = await GuildController.getCmdChanel(msg.guild);
    } catch (error) {
      SendMsg.cmdRes(
        bot,
        msg,
        CmdStatus.ERROR,
        error.toString()
      );
    }

    SendMsg.cmdRes(
      bot,
      msg,
      CmdStatus.SUCCESS,
      "Cmd channel is " + cmdChannel.name
    );
  }
}
