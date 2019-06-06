import { User } from "discord.js";
import { log } from "util";
import { getManager } from "typeorm";
import UserModel from "../models/userModel";
import { GuildModel } from "../models/guildModel";

/**
 * Manages bot-specific user data in the db
 *
 * @export
 * @class NoteStorageController
 */
export default class UserController {
  static async setGuild(user: User, guildName: string) {
    const mgr = getManager();

    const um = await mgr.findOne(UserModel, user.id);
    um.selectedGuild = guildName;
    await mgr.save(um);
  }

  static async getGuildName(user: User): Promise<string> {
    return (await this.assureExistsGetUserModel(user)).selectedGuild;
  }

  /**
   * Gets the selected guild id of the user
   *
   * @static
   * @param {User} user
   * @returns {Promise<string>}
   * @memberof UserController
   */
  static async getGuildId(user: User): Promise<string> {
    return await this.resolveGuildNameToId(
      (await this.assureExistsGetUserModel(user)).selectedGuild
    );
  }

  /**
   * Takes a guild name and returns its id
   *
   * @static
   * @param {string} name
   * @returns {Promise<string>}
   * @memberof UserController
   */
  static async resolveGuildNameToId(name: string): Promise<string> {
    return (await getManager().findOneOrFail(GuildModel, { where: { name } }))
      .id;
  }

  /**
   * Gets a userModel even if none exists by creating one if required
   *
   * @static
   * @param {User} user The user of whom to return the model of
   * @returns {Promise<UserModel>}
   * @memberof UserController
   */
  static async assureExistsGetUserModel(user: User): Promise<UserModel> {
    const mgr = getManager();

    let um: UserModel = await mgr.findOne(UserModel, user.id);
    if (um == null) {
      um = new UserModel();
      um.id = user.id;
      await mgr.save(um);
    }
    return um;
  }
}
