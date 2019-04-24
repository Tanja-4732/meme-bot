import { log } from "util";
import { Client, Message } from "discord.js";
import { spawnSync, SpawnSyncReturns } from "child_process";
import SendMsg, { CmdStatus } from "../utils/sendMsg";
import CmdChannel from "../commands/cmdChannel";
import Init from "../commands/init";
import CheckCmd from "../utils/checkCmd";
import AdminRole from "../commands/adminRole";

/**
 * This class parses commands; it doesn't handle message, dm or any other events
 *
 * This class implements methods for parsing commands and invokes other
 * functions, which in term implement the actual command. This class
 * doesn't handle discord.js events.
 *
 * @export
 * @class Command
 */
export default class Cmd {
  /**
   * This method parses and invokes commands
   *
   * This is accomplished using child processes.
   * A new child process is created for every command to be parsed.
   * This is done to work around the shortcomings of commander.js,as
   * the bot needs to stay online even after a command has been parsed.
   *
   * @static
   * @param {Client} bot The discord.js Client object
   * @param {Message} msg The message object from an event
   * @memberof Command
   */
  public static async useCmd(bot: Client, msg: Message): Promise<void> {
    /**
     * Error flag
     */
    let oof: boolean = false;

    /**
     * Return variable
     */
    let ret: SpawnSyncReturns<String>;
    try {
      /**
       * The parameters to be passed to spawnAsync
       *
       * They get initialized with the default parameters,
       * later, they get the user-defined ones concatenated.
       */
      let args: string[] = [
        "./dist/middlewares/guild/mb.js"
      ];

      // Concat the user-specified parameters to the others
      args = args.concat(
        msg.content
          // Split the user-specified parameters
          .split(/ +/)
          // Don't include the prefix
          .slice(1)
      );

      // Spawn a child process of the parseCmd.ts script with the args above
      ret = spawnSync("node", args);
    } catch (error) {
      oof = true;
      console.log("Be like:\n" + error.stdout.toString());
    }

    // Check if command execution was
    if (oof || ret.stdout == null) {
      // If the command couldn't be parsed
      log("memebot went oof");
      // msg.reply(JSON.stringify(ret, null, 2));
      throw new Error("Couldn't parse command");
    }

    /**
     * The error state
     */
    const status: CmdStatus =
      ret.stderr.toString() === "" ? CmdStatus.SUCCESS : CmdStatus.ERROR;

    /**
     * The complete response from the parser
     */
    const parserResponse: string =
      ret.stdout.toString() + ret.stderr.toString();

    // TODO remove
    log("ret status=" + ret.status);

    try {
      // Assure the message was sent from the cmd channel
      const sentInCmdChannel = await CheckCmd.isInCmdChannel(bot, msg);
      log("sentInCmdChannel=" + sentInCmdChannel);
      if (sentInCmdChannel) {

        // Check auth
        if (CheckCmd.hasAdminRole(bot, msg)) {

          // If authorized, call a static method to handle the requested command based on the status
          switch (ret.status) {
            // Resolve here
            case 0:
              // Version or help
              SendMsg.cmdRes(bot, msg, CmdStatus.INFO, parserResponse);
              break;
            case 1:
              // Something went wrong
              SendMsg.cmdRes(bot, msg, status, parserResponse);
              break;

            // 2 Initialize
            case 2001:
              // Initialize guild
              Init.init(bot, msg, ret.stdout.toString());
              break;

            // 3 Cmd channel
            case 3001:
              // Print the cmd channel
              CmdChannel.printCmdChannel(bot, msg);
              break;
            case 3002:
              // Set the cmd channel
              CmdChannel.setCmdChannel(bot, msg, ret.stdout.toString());
              break;
            case 3003:
              // Remove cmd channel requirement
              CmdChannel.removeChannel(bot, msg);
              break;

            // 4 Admin role
            case 4001:
              // Set the admin role without force
              AdminRole.setAdminRole(bot, msg, ret.stdout.toString());
              break;
            case 4002:
              // Set the admin role using force
              AdminRole.setAdminRoleForce(bot, msg, ret.stdout.toString());
              break;
            case 4003:
              // Print the admin role
              AdminRole.printAdminRole(bot, msg);
              break;

            // Errors
            case 4242:
              SendMsg.cmdRes(bot, msg, CmdStatus.ERROR, "error: No such command");
              break;
            default:
              log("Critical error, switch-fallthrough");
              break;
          }

        } else {
          // When not authorized
          SendMsg.cmdRes(bot, msg, CmdStatus.ERROR,
            "Unauthorized.\nThe admin privilege or the admin role is required");
        }

      } else {
        // When the message wasn't sent from the cmd channel
      }
    } catch (error) {
      switch (ret.status) {
        // When the guild isn't initialized
        case 0:
          // Version or help
          SendMsg.cmdRes(bot, msg, CmdStatus.INFO, parserResponse);
          break;
        case 1:
          // Something went wrong
          SendMsg.cmdRes(bot, msg, status, parserResponse);
          break;
        case 2001:
          // Initialize guild
          Init.init(bot, msg, ret.stdout.toString());
          break;
        case 4242:
          SendMsg.cmdRes(bot, msg, CmdStatus.ERROR, "error: No such command");
          break;
        default:
          SendMsg.cmdRes(
            bot,
            msg,
            CmdStatus.ERROR,
            "error: Guild not initialized"
          );
          break;
      }
    }
  }

  public static async useDmCmd(bot: Client, msg: Message): Promise<void> {

    /**
     * Error flag
     */
    let oof: boolean = false;

    /**
     * Return variable
     */
    let ret: SpawnSyncReturns<String>;
    try {
      /**
       * The parameters to be passed to spawnAsync
       *
       * They get initialized with the default parameters,
       * later, they get the user-defined ones concatenated.
       */
      let args: string[] = [
        "./dist/middlewares/dm/mb.js"
      ];

      // Concat the user-specified parameters to the others
      args = args.concat(
        msg.content
          // Split the user-specified parameters
          .split(/ +/)
          // Don't include the prefix
          .slice(1)
      );

      // Spawn a child process of the parseCmd.ts script with the args above
      ret = spawnSync("node", args);
    } catch (error) {
      oof = true;
      console.log("Be like:\n" + error.stdout.toString());
    }

    // Check if command execution was
    if (oof || ret.stdout == null) {
      // If the command couldn't be parsed
      log("memebot went oof");
      // msg.reply(JSON.stringify(ret, null, 2));
      throw new Error("Couldn't parse command");
    }

    /**
     * The error state
     */
    const status: CmdStatus =
      ret.stderr.toString() === "" ? CmdStatus.SUCCESS : CmdStatus.ERROR;

    /**
     * The complete response from the parser
     */
    const parserResponse: string =
      ret.stdout.toString() + ret.stderr.toString();

    // TODO remove
    log("ret status=" + ret.status);

    try {
      // If authorized, call a static method to handle the requested command based on the status
      switch (ret.status) {
        // Resolve here
        case 0:
          // Version or help
          SendMsg.cmdRes(bot, msg, CmdStatus.INFO, parserResponse);
          break;
        case 1:
          // Something went wrong
          SendMsg.cmdRes(bot, msg, status, parserResponse);
          break;

        // 2 Submit confession
        

        // Errors
        case 4242:
          SendMsg.cmdRes(bot, msg, CmdStatus.ERROR, "error: No such command");
          break;
        default:
          log("Critical error, switch-fallthrough");
          break;
      }
    } catch (error) {
      switch (ret.status) {
        // When the guild isn't initialized
        case 0:
          // Version or help
          SendMsg.cmdRes(bot, msg, CmdStatus.INFO, parserResponse);
          break;
        case 1:
          // Something went wrong
          SendMsg.cmdRes(bot, msg, status, parserResponse);
          break;
        case 2001:
          // Initialize guild
          Init.init(bot, msg, ret.stdout.toString());
          break;
        case 4242:
          SendMsg.cmdRes(bot, msg, CmdStatus.ERROR, "error: No such command");
          break;
        default:
          SendMsg.cmdRes(
            bot,
            msg,
            CmdStatus.ERROR,
            "error: Guild not initialized"
          );
          break;
      }
    }

  }

  public static async useGroupCmd(bot: Client, msg: Message): Promise<void> {
  }
}
