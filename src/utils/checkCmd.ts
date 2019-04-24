import { Client, Message, Role } from "discord.js";
import CmdChannel from "../commands/cmdChannel";
import SendMsg, { CmdStatus } from "./sendMsg";
import AdminRole from "../commands/adminRole";

export default class CheckCmd {
  public static async isInCmdChannel(
    bot: Client,
    msg: Message
  ): Promise<boolean> {
    const cmdChannel = (await CmdChannel.getCmdChannel(bot, msg)).id;
    return cmdChannel === msg.channel.id;
  }

  public static async hasAdminRole(
    bot: Client,
    msg: Message
  ): Promise<boolean> {
    const hasAdminRole: boolean = msg.member.roles.has((await AdminRole.getAdminRole(bot, msg)).id);
    const isGuildAdmin: boolean = msg.member.permissions.hasPermission("ADMINISTRATOR");

    return hasAdminRole || isGuildAdmin;
  }

}
