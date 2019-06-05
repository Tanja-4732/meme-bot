import { Guild, GuildChannel, Role, TextChannel } from "discord.js";
import { GuildModel } from "../models/guildModel";
import { EntityManager, getManager } from "typeorm";
import { log } from "util";

export default class GuildController {
  public static async registerGuild({
    guild,
    adminRoleId,
    cmdChannelId,
    name
  }: {
    guild: Guild;
    adminRoleId: string;
    cmdChannelId: string;
    name: string;
  }): Promise<void> {
    /**
     * The EntityManager to perform db operations on
     */
    const em: EntityManager = getManager();
    /**
     * The guild-model to be added to the db
     */
    const guildToRegister: GuildModel | any = {
      // TODO not very nice #61
      id: guild.id,
      adminRoleId,
      cmdChannelId,
      name
    };

    try {
      // Add the guild-model to the db
      await em.save(GuildModel, guildToRegister);
    } catch (error) {
      throw new Error("Error while registering guild:\n" + error);
    }
  }

  // TODO implement or remove
  // public static isInitialized(guild: Guild): boolean {
  //   try {
  //     const mgr = getManager();

  //     mgr.findOneOrFail(GuildModel, {
  //       where: { id: guild.id }
  //     });
  //   } catch (error) {}
  // }

  /**
   * Returns the cmd channel of a guild when enabled, returns null if the
   * dbc-channel requirement is disabled on the specified guild.
   *
   * @static
   * @param {Guild} guild The discord.js guild
   * @returns {Promise<GuildChannel>} The cmd-channel or null
   * @memberof GuildController
   */
  public static async getCmdChannel(guild: Guild): Promise<GuildChannel> {
    /**
     * The EntityManager to perform db operations on
     */
    const mgr: EntityManager = getManager();

    /**
     * The Guild-model of the guild
     */
    let gm: GuildModel;

    try {
      // Get the guild-data from the db
      gm = await mgr.findOne(GuildModel, {
        where: {
          id: guild.id
        }
      });
    } catch (error) {
      throw new Error(
        "Couldn't find guild. Make sure to initialize the guild."
      );
    }

    return guild.channels.get(gm.cmdChannelId);
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

      await em.save(g);
    } catch (error) {
      throw new Error(
        "Couldn't find guild or channel. Make sure to specify an existing channel and to initialize the guild."
      );
    }
  }

  static async removeCmdChannel(guild: Guild): Promise<void> {
    const mgr = getManager();

    const gm = await mgr.findOneOrFail(GuildModel, guild.id);
    gm.cmdChannelId = null;
    await mgr.save(gm);
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

      await em.save(g);
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

      return guild.channels.find(
        channel => channel.id === gm.confessionChannelId
      ) as TextChannel;
    } catch (error) {
      return null;
    }
  }

  public static async setConfessionChannel({
    guild,
    channelId
  }: {
    guild: Guild;
    channelId: string;
  }): Promise<void> {
    const mgr = getManager();

    try {
      const gm = await mgr.findOne(GuildModel, guild.id);
      gm.confessionChannelId = channelId;
      await mgr.save(gm);
    } catch (error) {
      throw new Error(error);
    }
  }

  public static async removeConfessionChannel(guild: Guild): Promise<void> {
    const mgr = getManager();
    try {
      const gm = await mgr.findOne(GuildModel, guild.id);
      gm.confessionChannelId = null;
      await mgr.save(gm);
    } catch (error) {
      log("big oof removing confessions:\n" + error);
      throw new Error(error);
    }
  }
  static async getMemeChannel(guild: Guild): Promise<GuildChannel | null> {
    const mgr = getManager();

    try {
      const gm = await mgr.findOne(GuildModel, guild.id);
      return guild.channels.find(channel => channel.id === gm.memeChannelId);
    } catch (error) {
      return null;
    }
  }

  static async setMemeChannel(guild: Guild, channelId: string): Promise<void> {
    const mgr = getManager();
    try {
      const gm = await mgr.findOne(GuildModel, guild.id);
      gm.memeChannelId = channelId;
      await mgr.save(gm);
    } catch (error) {
      log("big oof setting meme channel:\n" + error);
      throw new Error(error);
    }
  }

  static async disableMemeChannel(guild: Guild): Promise<void> {
    const mgr = getManager();

    const gm = await mgr.findOneOrFail(GuildModel, guild.id);
    gm.memeChannelId = null;
    await mgr.save(gm);
  }

  static async setDownvoteLimit(
    guild: Guild,
    downvoteLimit: number
  ): Promise<void> {
    const mgr = getManager();

    const gm = await mgr.findOne(GuildModel, guild.id);
    gm.downvoteLimit = downvoteLimit;
    await mgr.save(gm);
  }

  static async getDownvoteLimit(guild: Guild): Promise<number | null> {
    const mgr = getManager();

    const gm = await mgr.findOne(GuildModel, guild.id);
    return gm.downvoteLimit;
  }

  static async removeDownvoteLimit(guild: Guild): Promise<void> {
    const mgr = getManager();

    const gm = await mgr.findOne(GuildModel, guild.id);
    gm.downvoteLimit = null;
    await mgr.save(gm);
  }

  static async getAllInitializedGuildModels(): Promise<GuildModel[]> {
    return await getManager().find(GuildModel);
  }

  static async setName(guild: Guild, name: string): Promise<boolean> {
    try {
      const mgr = getManager();

      const gm: GuildModel = await mgr.findOneOrFail(GuildModel, {
        where: {
          id: guild.id
        }
      });

      gm.name = name;

      await mgr.save(gm);
      return true;
    } catch (error) {
      return false;
    }
  }

  static async getName(guild: Guild): Promise<string> {
    try {
      const mgr = getManager();

      const gm: GuildModel = await mgr.findOneOrFail(GuildModel, {
        where: {
          id: guild.id
        }
      });

      return gm.name;
    } catch (error) {
      throw error;
    }
  }

  static async getGuildModelByName(name: string): Promise<GuildModel> {
    const mgr = getManager();

    return await mgr.findOne(GuildModel, { where: { name } });
  }
}
