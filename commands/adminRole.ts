import { Client, Message, Role } from "discord.js";
import GuildController from "../controllers/guildController";
import ParseRef from "../utils/parseRef";
import SendMsg, { CmdStatus } from "../utils/sendMsg";
import { log } from "util";

export default class AdminRole {
  static async setAdminRole(bot: Client, msg: Message, adminRoleRef: string): Promise<void> {
    // TODO implement access-loss checks #32
    await this.setAdminRoleForce(bot, msg, adminRoleRef);
  }
  static async setAdminRoleForce(bot: Client, msg: Message, adminRoleRef: string): Promise<void> {
    /**
     * The role id parsed from adminRoleRef
     */
    const parsedRef = ParseRef.parseChannelRef(adminRoleRef);
    let adminRole: Role;

    try {
      log("roles:\n" + JSON.stringify(msg.guild, null ,2));
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

  static async printAdminRole(bot: Client, msg: Message): Promise<void> {
    log("Printing admin role");
    
    let adminRole: Role;
    
    try {
     adminRole = await GuildController.getAdminRole(msg.guild);
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
      "The admin role is @" + adminRole.name
    );
  }
}
