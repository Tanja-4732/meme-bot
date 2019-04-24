import { Client, Message } from "discord.js";
import { getManager, EntityManager } from "typeorm";

export default class Confession {
  public static postConfession(bot: Client, msg: Message): void {
    // TODO allow for multiple guilds #42
    const guildId: string = "557276089869664288";

    let confessionChannelId: string;
    try {
      const mgr: EntityManager = getManager();
      confessionChannelId = mgr.findOneOrFail()
    } catch (error) {

    }
  }
}