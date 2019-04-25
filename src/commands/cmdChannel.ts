import SendMsg, { CmdStatus } from "../utils/sendMsg";
import { Client, Message, GuildChannel } from "discord.js";
import GuildController from "../controllers/guildController";
import { log } from "util";
import ParseRef from "../utils/parseRef";

export default class CmdChannel {
  public static async removeChannel({
    bot,
    msg
  }: {
    bot: Client;
    msg: Message;
  }): Promise<void> {
    log("Remove cmd req (implement me) #30"); // TODO implement
  }

  public static async getCmdChannel({
    bot,
    msg
  }: {
    bot: Client;
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
    bot,
    msg
  }: {
    bot: Client;
    msg: Message;
  }): Promise<void> {
    let cmdChannel: GuildChannel;

    try {
      cmdChannel = await GuildController.getCmdChanel(msg.guild);
    } catch (error) {
      SendMsg.cmdRes({
        bot,
        msg,
        status: CmdStatus.ERROR,
        text: error.toString()
      });
      return;
    }

    SendMsg.cmdRes({
      bot,
      msg,
      status: CmdStatus.INFO,
      text: "The cmd channel is #" + cmdChannel.name
    });
  }

  public static async setCmdChannel({
    bot,
    msg,
    channelRef
  }: {
    bot: Client;
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
      await GuildController.setCmdChannel({ guild: msg.guild, channelId: parsedRef });
    } catch (error) {
      SendMsg.cmdRes({
        bot,
        msg,
        status: CmdStatus.ERROR,
        text: error.toString()
      });
      return;
    }

    // On success
    SendMsg.cmdRes({
      bot,
      msg,
      status: CmdStatus.SUCCESS,
      text: "Set cmd channel to #" + cmdChannel.name
    });
  }
}
