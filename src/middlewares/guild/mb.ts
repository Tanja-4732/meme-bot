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

function cmdChannel(channelName: string, cmd: any) {
  // Request the removal of the cmd channel
  if (cmd.disable) exit(3003);

  if (channelName == null) {
    // Request cmd channel to be printed
    exit(3001);
  }

  // Log channel name to be read later
  stdout.write(channelName);

  // Request setting the channel name
  exit(3002);
}

// Admin role
function setAdminRole(adminRoleRef: string, cmd: any) {
  // Check if a admin role was specified
  if (adminRoleRef != null) {
    // Output the desired adminRoleRef
    stdout.write(adminRoleRef);

    // Check if force is used
    if (cmd.force) {
      // Request an admin role change using force
      exit(4002);
    } else {
      // Request an admin role change without force
      exit(4001);
    }
  } else {
    // Request the admin role to be printed
    exit(4003);
  }
}

// Cong-Channel
function setConfChannel(confChannelRef: string, cmd: any) {
  // Check if a channel was specified
  if (confChannelRef != null) {
    // Check if disable is desired
    if (cmd.disable) {
      // Request error (can't set channel and disable it)
      exit(5004);
    }

    // Output the desired channel
    stdout.write(confChannelRef);

    // Request a confession channel change
    exit(5001);
  } else {
    // Check if disable is desired
    if (cmd.disable) {
      // Request disabling confessions
      exit(5002);
    } else {
      // Request printing the confession channel
      exit(5003);
    }
  }
}

function meme(memeChannelRef: string, options: any) {
  if (options.disable) {
    // Request the meme channel to be disabled
    exit(6001);
  } else {
    if (memeChannelRef == null) {
      // Request meme channel to be printed
      exit(6002);
    } else {
      // Output the desired meme channel
      stdout.write(memeChannelRef);

      // Request the meme channel to be set
      exit(6003);
    }
  }
}

function downvote(downvoteLimit: string, options: any) {
  if (options.disable) {
    // Request the downvote limit to be disabled
    exit(7001);
  } else {
    if (downvoteLimit == null) {
      // Request downvote limit to be printed
      exit(7002);
    } else {
      // Output the desired downvote limit
      stdout.write(downvoteLimit);

      // Request the downvote limit to be set
      exit(7003);
    }
  }
}

// Start
program
  .version("MemeBot version 0.5.0", "-v, --version")
  .description(
    "MemeBot - Automates and manages meme channels for Discord guilds"
  );

// Cmd-channel
program
  .command("cmd-channel [cmdChannel]")
  .description(
    "Set the cmd channel to [cmdChannel], or get the current cmd channel"
  )
  .alias("cmd")
  .option("-d, --disable", "Disable the cmd channel check")
  .action(cmdChannel);

// Initialize
program
  .command("initialize <adminRole>")
  .description(
    "Initialize this guild; Sets the cmd channel to the one this command is" +
      " issued in, and the admin role to <adminRole>"
  )
  .alias("init")
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

// confession channel
program
  .command("conf [confChannel]")
  .description(
    "Set the confession channel to [confChannel] (use a #channel-reference), or get the current confession channel"
  )
  .option(
    "-d, --disable",
    "Disable the confession channel. The channel remains unchanged."
  )
  .action(setConfChannel);

// Memes
program
  .command("meme-channel [memeChannel]")
  .description("Sets, disables or prints the [memeChannel].")
  .alias("meme")
  .option(
    "-d, --disable",
    "Disable the meme channel. The channel remains unchanged."
  )
  .action(meme);

// Downvote limit
program
  .command("downvote [downvote-limit]")
  .description("Sets, disables or prints the [downvote-limit]")
  .alias("dv")
  .option("-d, --disable", "Disable the downvote limit.")
  .action(downvote);

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
