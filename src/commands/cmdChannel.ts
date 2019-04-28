import SendMsg, { CmdStatus } from "../utils/sendMsg";
import { Client, Message, GuildChannel } from "discord.js";
import GuildController from "../controllers/guildController";
import { log } from "util";
import ParseRef from "../utils/parseRef";

export default class CmdChannel {
  public static async disableCmdChannel({
    msg
  }: {
    msg: Message;
  }): Promise<void> {
    try {
      await GuildController.removeCmdChannel(msg.guild);
      SendMsg.cmdRes({
        msg,
        status: CmdStatus.SUCCESS,
        text:
          "We successfully disabled the cmd channel requirement.\n" +
          "From now on, all channels can receive bot commands."
      });
    } catch (error) {
      SendMsg.cmdRes({
        msg,
        status: CmdStatus.ERROR,
        text: "We couldn't disable the cmd channel.\nThat's all we know."
      });
    }
  }

  public static async printCmdChannel({
    msg
  }: {
    msg: Message;
  }): Promise<void> {
    let cmdChannel: GuildChannel;

    try {
      cmdChannel = await GuildController.getCmdChannel(msg.guild);
    } catch (error) {
      SendMsg.cmdRes({
        msg,
        status: CmdStatus.ERROR,
        text: "We couldn't print the cmd channel.\nThat's all we know."
      });
      return;
    }

    SendMsg.cmdRes({
      msg,
      status: CmdStatus.INFO,
      text:
        "The cmd channel is " +
        (cmdChannel == null ? "disabled." : "#" + cmdChannel.name)
    });
  }

  public static async setCmdChannel({
    msg,
    channelRef
  }: {
    msg: Message;
    channelRef: string;
  }): Promise<void> {
    /**
     * The channel id parsed from channelRef
     */
    const parsedRef = ParseRef.parseChannelRef(channelRef);
    let cmdChannel: GuildChannel;

    try {
      cmdChannel = msg.guild.channels.get(parsedRef);
      await GuildController.setCmdChannel({
        guild: msg.guild,
        channelId: parsedRef
      });
    } catch (error) {
      SendMsg.cmdRes({
        msg,
        status: CmdStatus.ERROR,
        text: error.toString()
      });
      return;
    }

    // On success
    SendMsg.cmdRes({
      msg,
      status: CmdStatus.SUCCESS,
      text: "Set cmd channel to #" + cmdChannel.name
    });
  }
}
