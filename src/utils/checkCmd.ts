import { Client, Message, Role } from "discord.js";
import CmdChannel from "../commands/cmdChannel";
import SendMsg, { CmdStatus } from "./sendMsg";
import AdminRole from "../commands/adminRole";

export default class CheckCmd {
  /**
   * Checks, if a message was sent in the dedicated cmd channel of a guild.
   * If the cmd channel requirement is disabled, it returns true as well.
   *
   * @static
   * @param {Message} msg The message to be checked
   * @returns {Promise<boolean>} true if the cmd-channel is disabled or
   * the message was sent in the cmd channel
   * @memberof CheckCmd
   */
  public static async isInCmdChannel(msg: Message): Promise<boolean> {
    const cmdChannel = (await CmdChannel.getCmdChannel({ msg })).id;
    return cmdChannel == null || cmdChannel === msg.channel.id;
  }

  /**
   * Checks, if the author of a message has the dedicated memebot admin role of
   * the guild it was sent on. It also returns true, if the author of said
   * message has the administrator permission on the guild it was sent on.
   *
   * @static
   * @param {Message} msg The message of which the author should be checked
   * @returns {Promise<boolean>} true if the author of the message has the
   * dedicated admin role and/or has the administrator permission on the guild
   * @memberof CheckCmd
   */
  public static async hasAdminRole(msg: Message): Promise<boolean> {
    const hasAdminRole: boolean = msg.member.roles.has(
      (await AdminRole.getAdminRole({ msg })).id
    );
    const isGuildAdmin: boolean = msg.member.permissions.has("ADMINISTRATOR");

    return hasAdminRole || isGuildAdmin;
  }
}
