# MemeBot

Improve your meme-experience on your discord server the easy way, big-time.
**Work in progress, close to first pre-release**

## Table of contents

- [MemeBot](#memebot)
  - [Table of contents](#table-of-contents)
  - [Features](#features)
  - [Implementation](#implementation)
  - [Configuration](#configuration)
  - [Copyright notice](#copyright-notice)

The goad of the MemeBot is to organize a Discord servers meme channel into 9Gag-like areas.
This is accomplished by the owner creating two or three channels:

- Fresh
- Trending
- Hot

The trending area is optional (TODO).

When a submission reaches a certain number of upvotes (emoji-reactions, the up- and downvote emojis can be configured), it gets copied to the next area.

A user who doesn't want to get pinged that often may only subscribe to the Hot ara.

## Features

The MemeBot comes with many great features.
Here are a bunch of them:

- Copy memes form one area to the next
- Remove a copied meme from the old channel (optional)
- Allow/Prohibit anonymous posting
- Auto-remove disliked memes
- Alert an admin of repeated offenses

The admin can configure

- The number of upvotes required to get a post into the next area
- If downvoting should be allowed
- Which emoji gets treated as the upvote
- Which emoji gets treated as the downvote
- Whether or not the bot should take submissions via DM to submit anonymously

## Implementation

To improve your servers meme channel, tell your admin to execute the following easy steps:

1. Add the bot to the server
2. Create a dedicated bot-command channel
3. Write the `!MB init` command and hit return
4. Set up the channels that are going to be the areas for your memes (Fresh, Trending (optional), Hot)
5. Set up another set of area-channels to form another section (optional) (TODO)
6. Use `!MB section default area fresh #fresh` given `#fresh` is your channel name
7. Use `!MB section default area trending #trending` given `#trending` is your channel name (optional)
8. Use `!MB section default no area trending` to disable the trending area (optional)
9. Use `!MB section default area hot #hot` given `#hot` is your channel name

And you're all set.

## Configuration

As an admin you might want to configure more settings.
Here are your options

| Command                                                             | Purpose                                                                       |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `!MB --init`                                                          | Initializes the MemeBot (creates config files)                                |
| `!MB cmd-channel <channel_name>`                                    | Sets the channel to listen to commands to                                     |
| `!MB admin-role <role_name>`                                        | Sets the role the bot accept commands from                                    |
| `!MB section <section_name>`                                        | Defines a new section                                                         |
| `!MB section <section_name> init`                                   | Initialize a section with predefined channels (Fresh, Trending, Hot)          |
| `!MB no section <section_name>`                                     | Dissolves a section. Channels remain unchanged                                |
| `!MB section <section_name> area <area_name> #<channel_name>`       | Sets up a channel as an area and auto-sets its settings                       |
| `!MB section <section_name> no area <area_name>`                    | Releases a channel and removes an area; Can be used to deactivate trending    |
| `!MB section <section_name> an-post`                                | Allows anonymous posting to fresh via a DM to the bot                         |
| `!MB section <section_name> no an-post`                             | Prohibits anonymous posting to fresh via a DM to the bot                      |
| `!MB section <section_name> cooldown <number> <s/m>`                | Sets a cooldown on how fast a user can post new memes in seconds or minutes   |
| `!MB section <section_name> no cooldown`                            | Removes the cooldown from a section                                           |
| `!MB section <section_name> area <area_name> upvote-req <number>`   | The number of upvotes required to get to the next area                        |
| `!MB section <section_name> area <area_name> downvote-rem <number>` | The number of downvotes a meme must have to be deleted                        |
| `!MB section <section_name> area <area_name> no downvote-rem`       | Disables downvote-based automated meme removal                                |
| `!MB section <section_name> direct`                                 | Allows a user to post memes themselves in the first area (e.g. Fresh)         |
| `!MB section <section_name> no direct`                              | Disallows a user to post memes themselves                                     |
| `!MB section <section_name> delete-on-push`                         | If set, the upvoted meme gets deleted when moved into the next channel        |
| `!MB section <section_name> no delete-on-push`                      | If set, the upvoted meme doesn't get deleted when moved into the next channel |

## Copyright notice

**Copyright 2018 TheCrether & Bernd-L.  
All rights reserved.**
