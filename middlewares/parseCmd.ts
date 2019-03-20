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
  if (channelName == null) {
    // TODO remove
    log("print channel name");
    
    // Request cmd channel to be printed
    exit(3001);
  }

  // TODO remove
  log("Setting cmd-channel to " + channelName);
  
  // Log channel name to be read later
  log(channelName);

  // Request setting the channel name
  exit(3002);
}

program
  .version("MemeBot version 0.2.0", "-v, --version")
  .description("MemeBot - Automates and manages meme channels for Discord guilds");

// Cmd-channel
program
.command("cmd [cmdChannel]")
.description("Set the cmd channel to [cmdChannel], or get the current cmd channel")
// .alias("cmd-channel <cmdChannel>")
.alias("c")
.action(cmdChannel);

// Init
program
  .command("init")
  .description("Initialize this guild")
  .alias("i")
  .action(init);



program
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
