import { Client, Message, Role } from "discord.js";
import CmdChannel from "../commands/cmdChannel";
import SendMsg, { CmdStatus } from "./sendMsg";
import AdminRole from "../commands/adminRole";

export default class CheckCmd {
  public static async isInCmdChannel(msg: Message): Promise<boolean> {
    const cmdChannel = (await CmdChannel.getCmdChannel({ msg })).id;
    return cmdChannel === msg.channel.id;
  }

  public static async hasAdminRole(msg: Message): Promise<boolean> {
    const hasAdminRole: boolean = msg.member.roles.has(
      (await AdminRole.getAdminRole({ msg })).id
    );
    const isGuildAdmin: boolean = msg.member.permissions.hasPermission(
      "ADMINISTRATOR"
    );

    return hasAdminRole || isGuildAdmin;
  }
}
