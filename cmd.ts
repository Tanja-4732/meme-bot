import * as cmd from "commander";
import { log } from "util";
import { Client, Message } from "discord.js";

/**
 * This class parses commands; it doesn't handle message, dm or any other events
 *
 * This class implements methods for parsing commands and invokes other
 * functions, which in term implement the actual command. This class
 * doesn't handle discord.js events.
 * @export
 * @class Command
 */
export default class Cmd {
  // st: string = "MB --init";
  // st: string = "MB -v";
  // st: string = "MB -h";

  /**
   * This method parses and invokes commands
   *
   * @static
   * @param {Client} bot
   * @param {...any[]} args
   * @memberof Command
   */
  public static useCmd(bot: Client, msg: Message) {
    try {
      cmd
        .version("0.0.1", "-v, --version")
        .option("-i, --init", "Initialize ")
        .option(
          "-c <cmdChannel>, --cmd <cmdChannel>",
          "Set the cmd channel to <cmdChannel>"
        )
        .parse((" " + msg.content).split(/ +/));
      let ret = "";
      ret = cmd.init ? "init it now" : "don't init it";
      msg.reply(ret);
    } catch (error) {
      log("oof:\n" + error);
    }
  }
}
