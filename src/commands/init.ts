import { log } from "util";
import { Message, GuildMember } from "discord.js";
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
  public static async init({
    msg,
    adminRoleRef
  }: {
    msg: Message;
    adminRoleRef?: string;
  }): Promise<void> {
    /**
     * Anti-duplicate flag
     */
    let alreadyInitialized: boolean = false;

    // Check if the initializer is an admin
    if (
      !((msg.author as unknown) as GuildMember).permissions.has("ADMINISTRATOR")
    ) {
      SendMsg.cmdRes({
        text:
          "We couldn't initialize MemeBot for this guild, " +
          "for only a guild administrator may command so.\n" +
          "Make sure to have the ADMIN privilege and try again.",
        msg,
        status: CmdStatus.ERROR
      });
      return;
    }

    // Check if guild is already initialized
    try {
      // This should fail
      await GuildController.getCmdChannel(msg.guild);

      // If the guild is already initialized
      alreadyInitialized = true;
    } catch (error) {
      // If the guild isn't already initialized
      alreadyInitialized = false;
    }

    // Continue only if the guild isn't already initialized
    if (alreadyInitialized) {
      // If the guild is already initialized
      SendMsg.cmdRes({
        msg,
        status: CmdStatus.ERROR,
        text: "error: Guild already initialized"
      });
      return;
    }

    try {
      // Register the guild in the db
      await GuildController.registerGuild({
        guild: msg.guild,
        name: msg.guild.name,
        adminRoleId: null, // TODO set admin role on init
        // adminRoleId: ParseRef.parseRoleRef(adminRoleRef),
        cmdChannelId: msg.channel.id
      });
    } catch (error) {
      SendMsg.cmdRes({
        msg,
        status: CmdStatus.ERROR,
        text: "Something went wrong.\nThat's all we know."
      });
      return;
    }

    // Send success
    SendMsg.cmdRes({
      msg,
      status: CmdStatus.SUCCESS,
      text: "Guild successfully initialized.\n\n" + "Welcome to MemeBot!"
    });
  }
}
