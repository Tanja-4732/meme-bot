# MemeBot

Automated meme management for Discord

## Table of contents

- [MemeBot](#memebot)
  - [Table of contents](#table-of-contents)
  - [Features](#features)
  - [Getting started](#getting-started)
  - [Configuration](#configuration)
  - [Copyright notice](#copyright-notice)

## Features

MemeBot enriches your guild with the following features:

- Memes
  - Indirect posting
  - With attribution or anonymous
- Anonymous confessions
  - Optional coloring based on roles
- Reaction-based voting
  - Remove memes with too many downvotes
  - Vote contradiction mitigation (can't upvote AND downvote)

## Getting started

Setup is quick and easy.

1. Add the bot to the guild
2. Create a dedicated bot-command channel
3. Write the `mb init` command and hit return
4. Set up the channels that are going to be the areas for your memes (Fresh, Trending (optional), Hot)
5. Set up another set of area-channels to form another section (optional) (TODO)
6. Use `mb section default area fresh #fresh` given `#fresh` is your channel name
7. Use `mb section default area trending #trending` given `#trending` is your channel name (optional)
8. Use `mb section default no area trending` to disable the trending area (optional)
9. Use `mb section default area hot #hot` given `#hot` is your channel name

And you're all set.

## Configuration

You can always see the help using `mb -h`.

As an admin you might want to configure more settings.
Here are your options

| Command                                                            | Purpose                                                                       |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| `mb init`                                                          | Initializes the MemeBot (creates config files)                                |
| `mb cmd-channel <channel_name>`                                    | Sets the channel to listen to commands to                                     |
| `mb admin-role <role_name>`                                        | Sets the role the bot accept commands from                                    |
| `mb section <section_name>`                                        | Defines a new section                                                         |
| `mb section <section_name> init`                                   | Initialize a section with predefined channels (Fresh, Trending, Hot)          |
| `mb no section <section_name>`                                     | Dissolves a section. Channels remain unchanged                                |
| `mb section <section_name> area <area_name> #<channel_name>`       | Sets up a channel as an area and auto-sets its settings                       |
| `mb section <section_name> no area <area_name>`                    | Releases a channel and removes an area; Can be used to deactivate trending    |
| `mb section <section_name> an-post`                                | Allows anonymous posting to fresh via a DM to the bot                         |
| `mb section <section_name> no an-post`                             | Prohibits anonymous posting to fresh via a DM to the bot                      |
| `mb section <section_name> cooldown <number> <s/m>`                | Sets a cooldown on how fast a user can post new memes in seconds or minutes   |
| `mb section <section_name> no cooldown`                            | Removes the cooldown from a section                                           |
| `mb section <section_name> area <area_name> upvote-req <number>`   | The number of upvotes required to get to the next area                        |
| `mb section <section_name> area <area_name> downvote-rem <number>` | The number of downvotes a meme must have to be deleted                        |
| `mb section <section_name> area <area_name> no downvote-rem`       | Disables downvote-based automated meme removal                                |
| `mb section <section_name> direct`                                 | Allows a user to post memes themselves in the first area (e.g. Fresh)         |
| `mb section <section_name> no direct`                              | Disallows a user to post memes themselves                                     |
| `mb section <section_name> delete-on-push`                         | If set, the upvoted meme gets deleted when moved into the next channel        |
| `mb section <section_name> no delete-on-push`                      | If set, the upvoted meme doesn't get deleted when moved into the next channel |

## Copyright notice

**Copyright 2019 Bernd-L.  
Licensed under [the AGPLv3 license](https://github.com/Bernd-L/meme-bot/blob/master/LICENSE.md)**
