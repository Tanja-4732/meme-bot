import * as cmd from "commander";

/**
 * This script receives the parameters and does the actual parsing.
 * 
 * It runs in a child-process of the bot.
 */

cmd
  .version("MemeBot version 0.1.0", "-v, --version")
  .option("-i, --init", "Initialize")
  .option(
    "-c <cmdChannel>, --cmd <cmdChannel>",
    "Set the cmd channel to <cmdChannel>"
  )
  .parse(process.argv);

let ret = cmd.init ? "init it now" : "don't init it";

if (cmd.init){}

// Return the data
console.log(ret as string);

// Exit the process
process.exit(4201);