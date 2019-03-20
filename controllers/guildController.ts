import { Guild, GuildChannel } from "discord.js";
import { Guild as MGuild } from "../models/guildModel";
import { EntityManager, getManager } from "typeorm";

export default class GuildController {
  public static async registerGuild({
    id,
    adminRoleId,
    cmdChannelId,
    name
  }: {
    id: number;
    adminRoleId: number;
    cmdChannelId: number;
    name: string;
  }): Promise<void> {
    /**
     * The EntityManager to perform db operations on
     */
    const em: EntityManager = getManager();

    try {
      /**
       * The guild-model to be added to the db
       */
      const guildToRegister: MGuild = { id, adminRoleId, cmdChannelId, name, admins: [] };

      // Add the guild-model to the db
      await em.save(MGuild, guildToRegister);
    } catch (error) {
      throw Error("Error while registering guild:\n" + error);
    }
  }

  /**
   * Returns the cmd channel of a registered guild,
   * throws an error if the guild isn't initialized.
   *
   * @static
   * @param {Guild} guild The discord.js guild
   * @returns {Promise<GuildChannel>} The discord.js GuildChannel which is cmd channel
   * @memberof GuildController
   */
  public static async getCmdChanel(guild: Guild): Promise<GuildChannel> {
    /**
     * The EntityManager to perform db operations on
     */
    const em: EntityManager = getManager();

    /**
     * The Guild-model of the guild
     */
    let g: MGuild;

    try {
      // Get the guild-data from the db
      g = await em.findOneOrFail(MGuild, {
        where: {
          id: guild.id
        }
      });
    } catch (error) {
      throw Error(
        "Couldn't find guild or channel. Make sure to initialize the guild."
      );
    }
    return guild.channels.get(g.cmdChannelId + "");
  }
}
