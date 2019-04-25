import { Guild, GuildChannel, Role, TextChannel } from "discord.js";
import { GuildModel } from "../models/guildModel";
import { EntityManager, getManager } from "typeorm";
import { log } from "util";

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
      const guildToRegister: GuildModel = {
        id,
        adminRoleId,
        cmdChannelId,
        name,
        confessionChannelId: null,
        postingGroups: null
      };

      // Add the guild-model to the db
      await em.save(GuildModel, guildToRegister);
    } catch (error) {
      throw new Error("Error while registering guild:\n" + error);
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
    let g: GuildModel;

    try {
      // Get the guild-data from the db
      g = await em.findOneOrFail(GuildModel, {
        where: {
          id: guild.id
        }
      });
    } catch (error) {
      throw new Error(
        "Couldn't find guild. Make sure to initialize the guild."
      );
    }

    // Validate chanel
    if (guild.channels.get(g.cmdChannelId) == null) {
      throw new Error(
        "Couldn't find channel. Make sure to specify an existing channel."
      );
    }

    return guild.channels.get(g.cmdChannelId);
  }

  public static async setCmdChannel({
    guild,
    channelId
  }: {
    guild: Guild;
    channelId: string;
  }): Promise<void> {
    /**
     * The EntityManager to perform db operations on
     */
    const em: EntityManager = getManager();

    /**
     * The Guild-model of the guild
     */
    let g: GuildModel;

    try {
      // Get the guild-data from the db
      g = await em.findOneOrFail(GuildModel, {
        where: {
          id: guild.id
        }
      });

      // Validate chanel
      if (guild.channels.get(channelId) == null) {
        throw new Error();
      }

      // Set the channel
      g.cmdChannelId = channelId;

      em.save(g);
    } catch (error) {
      throw new Error(
        "Couldn't find guild or channel. Make sure to specify an existing channel and to initialize the guild."
      );
    }
  }

  static async getAdminRole(guild: Guild): Promise<Role> {
    /**
     * The EntityManager to perform db operations on
     */
    const em: EntityManager = getManager();

    /**
     * The Guild-model of the guild
     */
    let g: GuildModel;

    try {
      // Get the guild-data from the db
      g = await em.findOneOrFail(GuildModel, {
        where: {
          id: guild.id
        }
      });
    } catch (error) {
      throw new Error(
        "Couldn't find guild. Make sure to initialize the guild."
      );
    }

    // Validate role
    if (guild.roles.get(g.adminRoleId) == null) {
      throw new Error(
        "Couldn't find role. Make sure to specify an existing role."
      );
    }

    return guild.roles.get(g.adminRoleId);
  }

  /**
   * Sets the admin role for a guild on the db
   *
   * @static
   * @param {Guild} guild The discord.js guild object
   * @param {string} roleId The parsed role id
   * @returns {Promise<void>}
   * @memberof GuildController
   */
  public static async setAdminRole({
    guild,
    roleId
  }: {
    guild: Guild;
    roleId: string;
  }): Promise<void> {
    /**
     * The EntityManager to perform db operations on
     */
    const em: EntityManager = getManager();

    /**
     * The Guild-model of the guild
     */
    let g: GuildModel;

    try {
      // Get the guild-data from the db
      g = await em.findOneOrFail(GuildModel, {
        where: {
          id: guild.id
        }
      });

      log("Got this far 1");

      log("roles:\n" + JSON.stringify(guild, null, 2));

      // Validate role
      if (guild.roles.get(roleId) == null) {
        throw new Error("Invalid role");
      }

      // Set the channel
      g.adminRoleId = roleId;
      log("Got this far 2");

      em.save(g);
    } catch (error) {
      throw new Error(
        "Couldn't find guild or role. Make sure to specify an existing role and to initialize the guild."
      );
    }
  }

  public static async getConfessionChannel(
    guild: Guild
  ): Promise<TextChannel | null> {
    const mgr = getManager();

    try {
      const gm = await mgr.findOne(GuildModel, guild.id);

      return guild.channels.find("id", gm.confessionChannelId) as TextChannel;
    } catch (error) {
      return null;
    }
  }
}
