import { log } from "util";
import { Client, Message } from "discord.js";
import { spawnSync, SpawnSyncReturns } from "child_process";
import SendMsg, { CmdStatus } from "../utils/sendMsg";
import CmdChannel from "../commands/cmdChannel";
import Init from "../commands/init";
import CheckCmd from "../utils/checkCmd";
import AdminRole from "../commands/adminRole";
import Confession from "../commands/confession";
import StringUtils from "../utils/stringUtils";
import Meme from "../commands/meme";

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
      let args: string[] = ["./dist/middlewares/guild/mb.js"];

      // Concat the user-specified parameters to the others
      args = args.concat(
        // Split the user-specified parameters
        StringUtils.toArgv(msg.content)

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
     * The complete response from the parser
     */
    const parserResponse: string =
      ret.stdout.toString() + ret.stderr.toString();

    // TODO remove
    log("guild cmd: " + ret.status);

    try {
      // Assure the message was sent from the cmd channel
      const sentInCmdChannel = await CheckCmd.isInCmdChannel(msg);
      if (sentInCmdChannel) {
        // Check auth
        if (CheckCmd.hasAdminRole(msg)) {
          // If authorized, call a static method to handle the requested command based on the status
          switch (ret.status) {
            // Resolve here
            case 0:
              // Version or help
              SendMsg.cmdRes({
                msg,
                status: CmdStatus.INFO,
                text: parserResponse
              });
              break;
            case 1:
              // Something went wrong
              SendMsg.cmdRes({
                msg,
                status: CmdStatus.ERROR,
                text: parserResponse
              });
              break;

            // 2 Initialize
            case 2001:
              // Initialize guild
              Init.init({ msg, adminRoleRef: ret.stdout.toString() });
              break;

            // 3 Cmd channel
            case 3001:
              // Print the cmd channel
              CmdChannel.printCmdChannel({ msg });
              break;
            case 3002:
              // Set the cmd channel
              CmdChannel.setCmdChannel({
                msg,
                channelRef: ret.stdout.toString()
              });
              break;
            case 3003:
              // Remove cmd channel requirement
              CmdChannel.disableCmdChannel({ msg });
              break;

            // 4 Admin role
            case 4001:
              // Set the admin role without force
              AdminRole.setAdminRole({
                bot,
                msg,
                adminRoleRef: ret.stdout.toString()
              });
              break;
            case 4002:
              // Set the admin role using force
              AdminRole.setAdminRoleForce({
                msg,
                adminRoleRef: ret.stdout.toString()
              });
              break;
            case 4003:
              // Print the admin role
              AdminRole.printAdminRole({ msg });
              break;

            // 5 Confessions
            case 5001:
              // Set confession channel
              Confession.setConfessionChannel(msg, ret.stdout.toString());
              break;
            case 5002:
              // Disable confessions
              Confession.disableConfessions(msg);
              break;
            case 5003:
              // Print the confession channel
              Confession.printConfessionChannel(msg);
              break;
            case 5004:
              // Print error (can't set channel and disable it)
              SendMsg.cmdRes({
                msg,
                status: CmdStatus.ERROR,
                text: "Cannot set the confession channel whilst disabling it."
              });
              break;

            // 6 Memes
            case 6001:
              // Disable meme channel
              Meme.disableMemes(msg);
              break;
            case 6002:
              // Print meme channel
              Meme.printMemeChannel(msg);
              break;
            case 6003:
              // Set meme channel
              Meme.setMemeChannel(msg, ret.stdout.toString());
              break;

            // Errors
            case 4242:
              SendMsg.cmdRes({
                msg,
                status: CmdStatus.ERROR,
                text: "error: No such command"
              });
              break;
            default:
              log("Critical error, switch-fallthrough");
              break;
          }
        } else {
          // When not authorized
          SendMsg.cmdRes({
            msg,
            status: CmdStatus.ERROR,
            text:
              "Unauthorized.\nThe admin privilege or the admin role is required"
          });
        }
      } else {
        // When the message wasn't sent from the cmd channel
      }
    } catch (error) {
      switch (ret.status) {
        // When the guild isn't initialized
        case 0:
          // Version or help
          SendMsg.cmdRes({
            msg,
            status: CmdStatus.INFO,
            text: parserResponse
          });
          break;
        case 1:
          // Something went wrong
          SendMsg.cmdRes({
            msg,
            status: CmdStatus.ERROR,
            text: parserResponse
          });
          break;
        case 2001:
          // Initialize guild
          Init.init({ msg, adminRoleRef: ret.stdout.toString() });
          break;
        case 4242:
          SendMsg.cmdRes({
            msg,
            status: CmdStatus.ERROR,
            text: "error: No such command"
          });
          break;
        default:
          SendMsg.cmdRes({
            msg,
            status: CmdStatus.ERROR,
            text: "Something went wrong.\nThat's all we know."
          });
          break;
      }
    }
  }

  /**
   * Parse and execute commands received via a DM
   *
   * @static
   * @param {Client} bot The Discord.js Client
   * @param {Message} msg The message object from the event
   * @returns {Promise<void>}
   * @memberof Cmd
   */
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
      let args: string[] = ["./dist/middlewares/dm/mb.js"];

      // Concat the user-specified parameters to the others
      args = args.concat(
        // Split the user-specified parameters
        StringUtils.toArgv(msg.content)

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
     * The complete response from the parser
     */
    const parserResponse: string =
      ret.stdout.toString() + ret.stderr.toString();

    // TODO remove
    log("dm cmd: " + ret.status);

    try {
      // If authorized, call a static method to handle the requested command based on the status
      switch (ret.status) {
        // Resolve here
        case 0:
          // Version or help
          SendMsg.cmdRes({
            msg,
            status: CmdStatus.INFO,
            text: parserResponse
          });
          break;
        case 1:
          // Something went wrong
          log(parserResponse);
          SendMsg.cmdRes({
            msg,
            status: CmdStatus.ERROR,
            text: parserResponse
          });
          break;

        // 2 Submit confession
        case 2001:
          // Submit confession without age not gender
          Confession.postConfession({ bot, msg, text: ret.stdout.toString() });
          break;
        case 2002:
          // Submit confession with age without gender
          log(ret.stdout.toString());
          const { text, age } = StringUtils.getAgeAndText(
            ret.stdout.toString()
          );
          Confession.postConfession({ bot, msg, text, age });
          break;

        // 3 Memes
        case 3001:
          // Post meme anonymously
          Meme.postMeme(msg);
          break;
        case 3002:
          // Post meme with attribution
          break;

        // Errors
        case 4242:
          SendMsg.cmdRes({
            msg,
            status: CmdStatus.ERROR,
            text: "error: No such command"
          });
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
          SendMsg.cmdRes({
            msg,
            status: CmdStatus.INFO,
            text: parserResponse
          });
          break;
        case 1:
          // Something went wrong
          SendMsg.cmdRes({
            msg,
            status: CmdStatus.ERROR,
            text: parserResponse
          });
          break;
        case 2001:
          // Initialize guild
          Init.init({ msg, adminRoleRef: ret.stdout.toString() });
          break;
        case 4242:
          SendMsg.cmdRes({
            msg,
            status: CmdStatus.ERROR,
            text: "error: No such command"
          });
          break;
        default:
          SendMsg.cmdRes({
            msg,
            status: CmdStatus.ERROR,
            text: "Something went wrong.\nThat's all we know."
          });
          break;
      }
    }
  }

  public static async useGroupCmd(bot: Client, msg: Message): Promise<void> {}
}
