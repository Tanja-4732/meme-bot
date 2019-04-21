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
  public static async init(
    bot: Client,
    msg: Message,
    adminRoleRef: string
  ): Promise<void> {
    /**
     * Anti-duplicate flag
     */
    let alreadyInitialized: boolean = false;

    // Check if guild is already initialized
    try {
      // This should fail
      await GuildController.getCmdChanel(msg.guild);

      // If the guild is already initialized
      alreadyInitialized = true;
    } catch (error) {
      // If the guild isn't already initialized
      alreadyInitialized = false;
    }

    // Continue only if the guild isn't already initialized
    if (alreadyInitialized) {
      // If the guild is already initialized
      SendMsg.cmdRes(
        bot,
        msg,
        CmdStatus.ERROR,
        "error: Guild already initialized"
      );
      return;
    }

    // Register the guild in the db
    GuildController.registerGuild({
      id: msg.guild.id,
      name: msg.guild.name,
      adminRoleId: ParseRef.parseRoleRef(adminRoleRef),
      cmdChannelId: msg.channel.id
    });

    // Send success
    SendMsg.cmdRes(
      bot,
      msg,
      CmdStatus.SUCCESS,
      "Guild successfully initialized.\n\n" + "Welcome to MemeBot!"
    );
  }
}
