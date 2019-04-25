import { Client, Message, TextChannel } from "discord.js";
import { getManager, EntityManager } from "typeorm";
import { Guild as GuildModel } from "../models/guildModel";
import SendMsg, { CmdStatus } from "../utils/sendMsg";

export default class Confession {
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
    // TODO allow for multiple guilds #42
    const guildId: string = "557276089869664288";

    let confessionChannelId: string;
    try {
      const mgr: EntityManager = getManager();
      confessionChannelId = (await mgr.findOneOrFail(GuildModel, guildId))
        .confessionChannelId;
    } catch (error) {
      // Return an error message
      SendMsg.cmdRes({
        bot,
        msg,
        status: CmdStatus.ERROR,
        text: "The guild doesn't support confessions.",
        title: "Couldn't post"
      });
    }

    if (age != null) {
      // Post confession
      SendMsg.confession({
        bot,
        channel: bot.channels.find("id", confessionChannelId) as TextChannel,
        groupRole: null,
        text,
        age
      });
    } else {
      SendMsg.confession({
        bot,
        channel: bot.channels.find("id", confessionChannelId) as TextChannel,
        groupRole: null,
        text
      });
    }
  }
}
