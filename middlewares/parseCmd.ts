import * as program from "commander";
import { log } from "console";
import { exit, stdout } from "process";

/**
 * This script receives the parameters and does the actual parsing.
 *
 * It runs in a child-process of the bot.
 */

/**
 * Requests init and outputs adminRoleRef
 *
 * @param {string} adminRoleRef The mention of the admin role
 */
function init(adminRoleRef: string) {
  // Write the specified adminRoleRef to stdout
  stdout.write(adminRoleRef);

  // Request init
  exit(2001);
}

function cmdChannel(channelName: string) {
  if (channelName == null) {
    // Request cmd channel to be printed
    exit(3001);
  }

  // Log channel name to be read later
  stdout.write(channelName);

  // Request setting the channel name
  exit(3002);
}

program
  .version("MemeBot version 0.4.0", "-v, --version")
  .description(
    "MemeBot - Automates and manages meme channels for Discord guilds"
  );

// Cmd-channel
program
  .command("cmd [cmdChannel]")
  .description(
    "Set the cmd channel to [cmdChannel], or get the current cmd channel"
  )
  // .alias("cmd-channel <cmdChannel>")
  .alias("c")
  .option("-d, --disable", "Disable the cmd channel check")
  .action(cmdChannel);

// Init
program
  .command("init <adminRole>")
  .description(
    "Initialize this guild; Sets the cmd channel to the one this command is issued in" +
      ", and the admin role to <adminRole>"
  )
  .alias("i")
  .action(init);

program
  .on("--help", function() {
    log("");
    log("Examples:");
    log("");
    log("  mb --version");
    log("  mb -v");
    log("");
    log("  mb --help");
    log("  mb -h");
    log("");
    log("  mb init @AdminRole");
    log("  mb i @AdminRole");
    log("");
    log("  mb cmd #bot-commands");
    log("  mb c #bot-commands");
    log("  mb cmd");
    log("  mb c");
  })
  .parse(process.argv);

// Print help if no args are defined
if (!program.args.length) program.help();

// Exit the process
exit(4242);
