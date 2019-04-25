import { Client, Message, Role } from "discord.js";
import GuildController from "../controllers/guildController";
import ParseRef from "../utils/parseRef";
import SendMsg, { CmdStatus } from "../utils/sendMsg";
import { log } from "util";

export default class AdminRole {
  /**
   * Checks, if a user would lose access to the bot by changing the admin role and
   * only sets the admin role, if that wouldn't be the case
   *
   * @static
   * @param {Client} bot
   * @param {Message} msg
   * @param {string} adminRoleRef
   * @returns {Promise<void>}
   * @memberof AdminRole
   */
  static async setAdminRole({
    bot,
    msg,
    adminRoleRef
  }: {
    bot: Client;
    msg: Message;
    adminRoleRef: string;
  }): Promise<void> {
    if (
      msg.member.permissions.hasPermission("ADMINISTRATOR") ||
      msg.member.roles.has(ParseRef.parseChannelRef(adminRoleRef))
    ) {
      await this.setAdminRoleForce(bot, msg, adminRoleRef);
    } else {
      SendMsg.cmdRes({
        bot,
        msg,
        status: CmdStatus.WARNING,
        text:
          "Didn't change admin role.\nUser would lose access to bot.\nUse -f to force-set."
      });
    }
  }

  /**
   * Sets the admin role in every case.
   *
   * @static
   * @param {Client} bot
   * @param {Message} msg
   * @param {string} adminRoleRef
   * @returns {Promise<void>}
   * @memberof AdminRole
   */
  static async setAdminRoleForce(
    bot: Client,
    msg: Message,
    adminRoleRef: string
  ): Promise<void> {
    /**
     * The role id parsed from adminRoleRef
     */
    const parsedRef = ParseRef.parseChannelRef(adminRoleRef);
    let adminRole: Role;

    try {
      log("roles:\n" + JSON.stringify(msg.guild, null, 2));
      adminRole = msg.guild.roles.get(parsedRef);
      await GuildController.setAdminRole({ guild: msg.guild, roleId: parsedRef });
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
      text: "Set admin role to @" + adminRole.name
    });
  }

  static async printAdminRole({
    bot,
    msg
  }: {
    bot: Client;
    msg: Message;
  }): Promise<void> {
    log("Printing admin role");

    SendMsg.cmdRes({
      bot,
      msg,
      status: CmdStatus.INFO,
      text: "The admin role is @" + (await this.getAdminRole({ bot, msg })).name
    });
  }

  public static async getAdminRole({
    bot,
    msg
  }: {
    bot: Client;
    msg: Message;
  }): Promise<Role> {
    try {
      return await GuildController.getAdminRole(msg.guild);
    } catch (error) {
      SendMsg.cmdRes({
        bot,
        msg,
        status: CmdStatus.ERROR,
        text: error.toString()
      });
      return;
    }
  }
}
