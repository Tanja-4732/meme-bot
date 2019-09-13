# MemeBot

Automated meme management for Discord

## Table of contents

- [MemeBot](#memebot)
  - [Table of contents](#table-of-contents)
  - [Features](#features)
  - [Getting started](#getting-started)
  - [Configuration](#configuration)
  - [Users' manual](#users-manual)
  - [Hosting](#hosting)
  - [Copyright notice](#copyright-notice)

## Features

MemeBot enriches a guild with the following features:

- Memes
  - Indirect posting
  - With attribution or anonymous
- Anonymous confessions
  - Optional coloring based on roles
- Reaction-based voting
  - Remove memes with too many downvotes
  - Vote contradiction mitigation (can't upvote AND downvote)
- Multi-guild support
  - One instance of MemeBot may serve several guilds at once

## Getting started

Setup is quick and easy.

1. Get an instance of MemeBot and its invite link
2. Add MemeBot to the guild using said invite link
3. Create a dedicated bot-command channel
4. Type the `mb init` command and hit return in the bot-command channel
5. Create a meme channel and a confession channel (if they don't exist already; both are optional)
6. Optional (but recommended) configuration
   1. Enter `mb meme #meme-channel-name` to set the meme channel
   2. Enter `mb confession #confession-channel-name` to set the confession channel
7. You may enter the `mb downvote 10` command to set the downvote limit to `<=10`
8. Enter the `mb name mas` to set the guilds name to "mas" (see [configuration](##Configuration))

And you're all set.

## Configuration

MemeBot provides help to any command using the `mb -h` command.
Any other sub-command may also get `-h` appended to learn more about it.

Most commands and options have abbreviations. Check `mb -h` to see the all.
For example, `--disable` may be substituted by `-d`, and `cmd-channel` by `cmd`.

The following may be configured by an admin:

- Meme channel `mb meme -h`
  - Set to a channel `mb meme #meme-channel`
    - The old channel will not get modified
    - The new channel will become the chanel in which MemeBot posts new memes
  - Disable `mb meme --disable`
    - Disables all meme functionality of MemeBot for the guild
    - The old meme channel will not be deleted or modified
  - Print the meme channel `mb meme`
    - Used to see wich channel (if any) is configured as the meme channel for this guild
- Confession channel
  - Set to a channel `mb meme #confession-channel`
    - The old channel will not get modified
    - The new channel will become the chanel in which MemeBot posts new confessions
  - Disable `mb conf --disable`
    - Disables all confession functionality of MemeBot for the guild
    - The old confession channel will not be deleted or modified
  - Print the confession channel `mb conf`
    - Used to see wich channel (if any) is configured as the confession channel for this guild
- Cmd channel
  - Set the cmd channel `mb cmd-channel #commands`
    - Configures the channel in which MemeBot will listen for commands
  - Disable the cmd channel `mb cmd-channel --disable`
    - Disables the command channel
    - MemeBot will be listening for commands in all channels
    - The command channel is set by default to the one in which `mb init` was entered initially
  - Print the cmd channel
    - Used to see wich channel (if any) is configured as the command channel for this guild
- Admin role `mb admin -h`
  - Set the admin role `mb admin @BotAdmin`
    - MemeBot will ignore all commands issued by users without the admin role or the Administrator guild privilege
  - Disable the admin role `mb admin --disable`
    - MemeBot will use all commands issued in the command channel (if set, otherwise all messages beginning with `mb` are interpreted as commands)
  - Print the admin role `mb admin`
    - Used to see wich channel (if any) is configured as the meme channel for this guild
- Downvote limit `mb downvote -h`
  - Set the downvote limit `mb downvote 10`
    - Sets the downvote limit to 10
    - Any meme with 11 or more downvotes will be removed by MemeBot
    - Using `mb downvote 0` will result in any downvote issued removing a meme
    - Already downvoted memes will not be re-checked if they still meet the condition
    - Already downvoted memes will be removed once they don't meet the condition after a downvote
  - Disable the downvote limit `mb downvote --disable`
    - The downvote condition will get removed
    - Memes which have been removed already will not get posted again
  - Print the downvote limit `mb downvote`
    - Used to see which number (if any) is configured as the downvote limit for this guild
- Guild name `mb name -h`
  - It's like a domain name for the guild, it must be unique and should be short. "My amazing server" may have "mas"
  - Set the guild name `mb name nameOfGuild`
    - Where "nameOfGuild" is the desired name
  - Print the name `mb name`
    - Prints the configured name
  - The name may not be disabled
    - Users need it to interact with the guild using MemeBot
- Guild initialization `mb init`
  - This command must be run once before all others
  - Only someone with the Administrator guild-privilege may execute it
  - It sets up the guild in MemeBots database
  - It sets the guilds command channel to the one, in which this command was issued
  - Setting the admin role is not supported at this step

## Users' manual

This section focuses on how a user (non-admin) may interact with MemeBot.

A user may only interact with MemeBot via a direct message (DM) to MemeBot.
For more details a user may always DM MemeBot with `mb -h`.
Furthermore, `-h` may be appended to any command to learn more about any command.

A user can:

- Select a server
  - This is required for MemeBot to know where to post
    - Neither memes nor confessions can be submitted without this
  - Enter `mb server serverName` where "serverName" is the name configured by the admins
  - The user can view the selected server using `mb server`
  - Deselecting a selected server is not supported (but changing it is)
- Submit memes
  - Post meme first (picture or video)
  - Then enter `mb meme` (add `-a` to stay anonymous)
- Submit confessions
  - Type `mb conf "My multi-word confession with \"escaped quotes\" and a closing quote"`
  - Confessions are always posted anonymously
  - Confessions must be enclosed with double quotes `"`
  - If a confession should contain quotes itself, they must be escaped `\"`

## Hosting

If you want to host MemeBot yourself, you'll need to follow these steps:

1. Get the source code (e.g. `git clone git clone git@github.com:Bernd-L/ meme-bot.git`)
2. Install [Node.js](https://nodejs.org/en/download/)
3. Install [PostgreSQL](https://www.postgresql.org/download/)
4. Run `npm install` within the source folder
5. Create (or reuse existing) withing PostgreSQL
   1. A user (with the login privilege and a password)
   2. A database (owned by the user)
   3. A schema within the database (owned by the user)
6. Set the environment variables in the table below
7. Start MemeBot using `npm start`

The environment variables:

| Description                                        | Environment variable name | Example value(s)                                  |
| -------------------------------------------------- | ------------------------- | ------------------------------------------------- |
| The hostname of the PostgreSQL server              | `MB_HOST`                 | `localhost`, `memebot-db.example.com`             |
| The post of the PostgreSQL server                  | `MB_PORT`                 | `5432` (It's recommended to use this one)         |
| The username of the PostgreSQL user                | `MB_USER`                 | `mb`, `memebot_user`                              |
| The password of the                                | `MB_PWD`                  | `mb`, `Sup€rPassword123`                          |
| The name of the PostgreSQL database used by MemBot | `MB_DB`                   | `mb`                                              |
| If SSL should be used to connect to the DB         | `MB_SSL`                  | `false`, `true`                                   |
| The mode of operation of MemeBot                   | `MB_MODE`                 | `development`, `production`                       |
| The PostgreSQL schema to be used by MemeBot        | `MB_SCHEMA`               | `public`, `mb_dev`                                |
| The token issued by Discord to connect MemeBot     | MB_TOKEN                  | `NSkjsd7349SDjlkj.sdfjNCS28.sdjJDS83349JWdjsdjgn` |

## Copyright notice

**Copyright 2019 Bernd-L.  
Licensed under [the AGPLv3 license](https://github.com/Bernd-L/meme-bot/blob/master/LICENSE.md).**
