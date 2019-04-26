import SendMsg, { CmdStatus } from "../utils/sendMsg";
import { Client, Message, GuildChannel } from "discord.js";
import GuildController from "../controllers/guildController";
import { log } from "util";
import ParseRef from "../utils/parseRef";

export default class CmdChannel {
  public static async removeChannel({ msg }: { msg: Message }): Promise<void> {
    log("Remove cmd req (implement me) #30"); // TODO implement
  }

  public static async getCmdChannel({
    msg
  }: {
    msg: Message;
  }): Promise<GuildChannel> {
    let cmdChannel: GuildChannel;

    try {
      cmdChannel = await GuildController.getCmdChanel(msg.guild);
    } catch (error) {
      throw new Error("Couldn't find the cmd channel");
    }

    return cmdChannel;
  }

  public static async printCmdChannel({
    msg
  }: {
    msg: Message;
  }): Promise<void> {
    let cmdChannel: GuildChannel;

    try {
      cmdChannel = await GuildController.getCmdChanel(msg.guild);
    } catch (error) {
      SendMsg.cmdRes({
        msg,
        status: CmdStatus.ERROR,
        text: error.toString()
      });
      return;
    }

    SendMsg.cmdRes({
      msg,
      status: CmdStatus.INFO,
      text: "The cmd channel is #" + cmdChannel.name
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
