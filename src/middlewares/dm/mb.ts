import * as program from "commander";
import { log } from "console";
import { exit, stdout } from "process";

/**
 * This script receives the parameters and does the actual parsing.
 *
 * It runs in a child-process of the bot.
 */

function confession(confMsg: string) {
  // Write the specified adminRoleRef to stdout
  stdout.write(confMsg);

  // Request init
  exit(2001);
}

// Start
program
  .version("MemeBot version 0.5.0", "-v, --version")
  .description(
    "MemeBot - Automates and manages meme channels for Discord guilds"
  );

// Confession
program
  .command("conf <confession message>")
  .description(
    "Post an anonymous <confession message>. Using\"quote marks\" is required."
  )
  .alias("c")
  // .option("-d, --disclose", "Post non-anonymous")
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

// Set admin role
program
  .command("admin [adminRole]")
  .description(
    "Set the admin role to [adminRole] (use a @roleReference), or get the current admin role"
  )
  .alias("a")
  .option(
    "-f, --force",
    "Change the admin role even if it means losing access to the bot"
  )
  .action(setAdminRole);

// Help
program
  .option("-e, --examples", "Print examples with the help output")
  .on("--help", function() {
    log("");
    if (program.examples) {
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
    } else {
      log("Print examples using --examples or -e");
    }
  });

// Parse
program.parse(process.argv);

// Print help if no args are defined
if (!program.args.length) program.help();

// Exit the process
exit(4242);
