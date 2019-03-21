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
    id: string;
    adminRoleId: string;
    cmdChannelId: string;
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
      const guildToRegister: MGuild = { id, adminRoleId, cmdChannelId, name };

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
        "Couldn't find guild. Make sure to initialize the guild."
      );
    }

    // Validate chanel
    if (guild.channels.get(g.cmdChannelId) == null) {
      throw Error(
        "Couldn't find channel. Make sure to specify an existing channel."
      );
    }

    return guild.channels.get(g.cmdChannelId);
  }

  public static async setCmdChannel(
    guild: Guild,
    channelId: string
  ): Promise<void> {
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

      // Validate chanel
      if (guild.channels.get(channelId) == null) {
        throw Error();
      }

      // Set the channel
      g.cmdChannelId = channelId;


      em.save(g);
    } catch (error) {
      throw Error(
        "Couldn't find guild or channel. Make sure to specify an existing channel and to initialize the guild."
      );
    }
  }
}
