import * as program from "commander";
import { log } from "console";
import { exit, stdout } from "process";

/**
 * This script receives the parameters and does the actual parsing.
 *
 * It runs in a child-process of the bot.
 */

function confession(text: string, cmd: any) {
  if (cmd.age == null) {
    exit(2001);
  } else {
    // Write the specified adminRoleRef to stdout
    stdout.write(cmd);

    // Request init
    exit(2002);
  }
}

// Start
program
  .version("MemeBot version 0.5.0", "-v, --version")
  .description(
    "MemeBot - Automates and manages meme channels for Discord guilds"
  );

// Confession
program
  .command("confession <confession message>")
  .description(
    "Post an anonymous <confession message>. Using\"quote marks\" is required."
  )
  .alias("conf")
  .option("-a <age>, --age <age>", "specify ones age")
  .action(confession);

// Help
program
  .option("-e, --examples", "Print examples with the help output")
  .on("--help", function () {
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
      log("  mb confession \"I did stuff.\"");
      log("  mb conf \"I did stuff.\"");
      log("");
      log("  mb submit");
      log("  mb sub");
      log("  mb abort");
      log("  mb abt");
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
