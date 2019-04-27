import { Client, Collection, Guild } from "discord.js";

export default class DmGuildLogic {
  public static mutualGuilds(
    bot: Client,
    id: string
  ): Collection<string, Guild> {
    return bot.guilds.filter(guild => {
      return guild.members.find(member => member.id === id) != null;
    });
  }
}
