import { log } from "util";
import { Client, Message } from "discord.js";
import ParseRef from "../utils/parseRef";
import GuildController from "../controllers/guildController";
import SendMsg, { CmdStatus } from "../utils/sendMsg";

export default class Init {
  /**
   * Initializes a guild
   * 
   * Sets the cmd channel and the admin role,
   * and adds the required records to the db.
   *
   * @static
   * @param {Client} bot The discord.js Client
   * @param {Message} msg The discord.js message from an event
   * @param {string} adminRoleRef The output-ed string of the cmdParser
   * @memberof Init
   */
  public static async init(bot: Client, msg: Message, adminRoleRef: string): Promise<void> {
    log("Init...");
    /**
     * Anti-duplicate flag
     */
    let alreadyInitialized: boolean;

    // Check if guild is already initialized
    try {
      // This should fail
      await GuildController.getCmdChanel(msg.guild);
      alreadyInitialized = true;
    } catch (error) {
      alreadyInitialized = false;
    }
    
    if (alreadyInitialized) {
      SendMsg.cmdRes(bot, msg, CmdStatus.ERROR, "error: Guild already initialized");
      return;
    }
  
    // GuildController.registerGuild({id: msg.guild.id, name: msg.guild.name, })

    log(ParseRef.parseRoleRef(adminRoleRef));
    log(msg.channel.id);

    log("init done.");
  }
}
