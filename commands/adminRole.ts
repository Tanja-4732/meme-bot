import { Client, Message, Role } from "discord.js";
import GuildController from "../controllers/guildController";
import ParseRef from "../utils/parseRef";
import SendMsg, { CmdStatus } from "../utils/sendMsg";

export default class AdminRole {
  static async setAdminRole(bot: Client, msg: Message, adminRoleRef: string): Promise<void> {}
  static async setAdminRoleForce(bot: Client, msg: Message, adminRoleRef: string): Promise<void> {
    /**
     * The role id parsed from adminRoleRef
     */
    const parsedRef = ParseRef.parseChannelRef(adminRoleRef);
    let adminRole: Role;

    try {
     adminRole = msg.guild.roles.get(parsedRef);
     await GuildController.setAdminRole(msg.guild, parsedRef);
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
      "Set admin role to @" + adminRole.name
    );
  
  }
}
