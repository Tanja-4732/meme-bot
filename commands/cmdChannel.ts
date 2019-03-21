import SendMsg, { CmdStatus } from "../utils/sendMsg";
import { Client, Message, GuildChannel } from "discord.js";
import GuildController from "../controllers/guildController";
import { log } from "util";
import ParseRef from "../utils/parseRef";

export default class CmdChannel {

  public static async getCmdChannel(bot: Client, msg: Message): Promise<GuildChannel> {
    let cmdChannel: GuildChannel;
    
    try {
     cmdChannel = await GuildController.getCmdChanel(msg.guild);
    } catch (error) {
      throw Error("Couldn't find the cmd channel")
    }

    return cmdChannel;
  }

  public static async printCmdChannel(bot: Client, msg: Message): Promise<void> {
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
      return;
    }

    SendMsg.cmdRes(
      bot,
      msg,
      CmdStatus.INFO,
      "Cmd channel is " + cmdChannel.name
    );
  }

  public static async setCmdChannel(bot: Client, msg: Message, channelRef: string): Promise<void> {
    /**
     * The channel id parsed from channelRef
     */
    const parsedRef = ParseRef.parseChannelRef(channelRef);
    let cmdChannel: GuildChannel;

    try {
     cmdChannel = msg.guild.channels.get(parsedRef);
     await GuildController.setCmdChannel(msg.guild, parsedRef);
    } catch (error) {
      SendMsg.cmdRes(
        bot,
        msg,
        CmdStatus.ERROR,
        error.toString()
      );
      return;
    }

    // On success
    SendMsg.cmdRes(
      bot,
      msg,
      CmdStatus.SUCCESS,
      "Set cmd channel to " + cmdChannel.name
    );
  }
}
