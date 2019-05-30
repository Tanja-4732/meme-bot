import * as program from "commander";
import { log } from "console";
import { exit, stdout } from "process";

/**
 * This script receives the parameters and does the actual parsing.
 *
 * It runs in a child-process of the bot.
 */

function confession(text: string, options: any) {
  // Check if an age was specified
  if (options.age == null) {
    // Write the specified adminRoleRef to stdout
    stdout.write(text);

    // Request posting a confession without age and gender info
    exit(2001);
  } else {
    // TODO this doesn't work #53
    // Write the age with a delimiter
    stdout.write(options.age + ";");

    // Write the specified adminRoleRef to stdout
    stdout.write(text);

    // Request posting a confession with age info without gender
    exit(2002);
  }
}

function meme(options: any) {
  if (options.anonymous) {
    // Request posting meme anonymously
    exit(3001);
  } else {
    // Request posting meme with attribution
    exit(3002);
  }
}

// Start
program
  .version("MemeBot version 0.6.0", "-v, --version")
  .description(
    "MemeBot - Automates and manages meme channels for Discord guilds"
  );

// Confession
program
  .command("confession <confession message>")
  .alias("conf")
  .description(
    'Post an anonymous <confession message>. Using"quote marks" is required.'
  )
  .option("-a <age>, --age <age>", "specify ones age")
  .action(confession);

program
  .command("meme")
  .description(
    "Post a meme! Send your picture or video first, then use this command.\n" +
      "This will post the last received picture or video either with attribution (named) or anonymously."
  )
  .option("-a, --anonymous", "Post the meme anonymous")
  .action(meme);

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
      log('  mb confession "I did stuff."');
      log('  mb conf "I did stuff."');
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
