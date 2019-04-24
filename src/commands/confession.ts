import { Client, Message } from "discord.js";
import { getManager, EntityManager } from "typeorm";
import { Guild as GuildModel } from "../models/guildModel";
import SendMsg, { CmdStatus } from "../utils/sendMsg";

export default class Confession {
  public static async postConfession(bot: Client, msg: Message): Promise<void> {
    // TODO allow for multiple guilds #42
    const guildId: string = "557276089869664288";

    let confessionChannelId: string;
    try {
      const mgr: EntityManager = getManager();
      confessionChannelId = (await mgr.findOneOrFail(GuildModel, guildId)).confessionChannelId;
    } catch (error) {
      // Return an error message
      SendMsg.cmdRes(bot, msg, CmdStatus.ERROR,
        "The guild doesn't support confessions.", "Couldn't post")
    }
    
    // Post confession
    
  }
}