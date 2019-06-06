import { Client, Message, TextChannel, Role } from "discord.js";
import { getManager, EntityManager } from "typeorm";
import { GuildModel } from "../models/guildModel";
import SendMsg, { CmdStatus } from "../utils/sendMsg";
import GuildController from "../controllers/guildController";
import ParseRef from "../utils/parseRef";
import { log } from "util";
import UserController from "../controllers/userController";

export default class Confession {
  /**
   * Handles the post confession commands
   *
   * @static
   * @returns {Promise<void>}
   * @memberof Confession
   */
  public static async postConfession({
    bot,
    msg,
    text,
    age
  }: {
    bot: Client;
    msg: Message;
    text: string;
    age?: number;
  }): Promise<void> {
    const guildId: string = await UserController.getGuildId(msg.author);

    let confessionChannelId: string;
    try {
      const mgr: EntityManager = getManager();
      confessionChannelId = (await mgr.findOneOrFail(GuildModel, guildId))
        .confessionChannelId;
    } catch (error) {
      // Return an error message
      SendMsg.cmdRes({
        msg,
        status: CmdStatus.ERROR,
        text: "The guild doesn't support confessions.",
        title: "Couldn't post"
      });
    }

    /**
     * The role to be used for coloring the message
     */
    const groupRole = bot.guilds

      // Get the guild
      .find(guild => guild.id === guildId)

      // Get the member of the guild
      .members.find(member => member.id === msg.author.id)

      // Get the lowest role // TODO allow for a role to be specified #44
      .roles.last();

    // Post confession
    if (age != null) {
      // Post with age
      SendMsg.confession({
        channel: bot.channels.find(
          channel => channel.id === confessionChannelId
        ) as TextChannel,
        groupRole,
        text,
        age
      });
    } else {
      // Post without age
      SendMsg.confession({
        channel: bot.channels.find(
          channel => channel.id === confessionChannelId
        ) as TextChannel,
        groupRole,
        text
      });
    }
  }

  public static async printConfessionChannel(msg: Message): Promise<void> {
    const confessionChannel = await GuildController.getConfessionChannel(
      msg.guild
    );

    SendMsg.cmdRes({
      msg,
      status: CmdStatus.INFO,
      text:
        "The confession channel is " +
        (confessionChannel == null
          ? "disabled."
          : "set to #" + confessionChannel.name)
    });
  }

  public static disableConfessions(msg: Message) {
    try {
      GuildController.removeConfessionChannel(msg.guild);

      // Send confirmation message
      SendMsg.cmdRes({
        msg,
        status: CmdStatus.SUCCESS,
        text: "We've disabled confessions successfully."
      });
    } catch (error) {
      SendMsg.cmdRes({
        msg,
        status: CmdStatus.ERROR,
        text: "We couldn't disable confessions.\nThat's all we know."
      });
    }
  }

  public static setConfessionChannel(msg: Message, channelRef: string) {
    try {
      const channelId = ParseRef.parseChannelRef(channelRef);
      GuildController.setConfessionChannel({ guild: msg.guild, channelId });

      // Send confirmation message
      SendMsg.cmdRes({
        msg,
        status: CmdStatus.SUCCESS,
        text:
          "Set the confession channel to #" +
          msg.guild.channels.find(channel => channel.id === channelId).name
      });
    } catch (error) {
      SendMsg.cmdRes({
        msg,
        status: CmdStatus.ERROR,
        text: "Couldn't set the confession channel.\nThat's all we know."
      });
    }
  }
}
