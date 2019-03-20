import * as program from "commander";
import { log } from "console";
import { exit } from "process";

/**
 * This script receives the parameters and does the actual parsing.
 * 
 * It runs in a child-process of the bot.
 */


function init() {
  log("Initialize...");
  exit(2001);
}

function cmdChannel(channelName: string) {
  log("Setting cmd-channel to " + channelName);
  exit(2002);
}

program
  .version("MemeBot version 0.2.0", "-v, --version")
  .description("MemeBot - Automates and manages meme channels for Discord guilds")
  .option("-i, --init", "Initialize", init)
  .option(
    "-c <cmdChannel>, --cmd-channel <cmdChannel>",
    "Set the cmd channel to <cmdChannel>", cmdChannel
  )
  .on("--help", function(){
    log("");
    log("Examples:");
    log("");
    log("  mb --help");
    log("  mb -h");
    log("  mb --init");
    log("  mb -i");
    log("  mb --cmd-channel #bot-commands");
    log("  mb -c #bot-commands");
  })
  .parse(process.argv);

// Print help if no args are defined
if (!program.args.length) program.help();

// Exit the process
exit(4201);