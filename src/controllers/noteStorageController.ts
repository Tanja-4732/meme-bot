import { User } from "discord.js";

/**
 * Stores data in the discord notes of a user
 *
 * @export
 * @class NoteStorageController
 */
export default class NoteStorageController {
  static async setGuild(user: User, guildName: string) {
    const userNotes = await this.getUserNotesObject(user);
    userNotes.selectedGuild = guildName;
    this.setUserNotesObject(user, userNotes);
  }

  static async getUserNotesObject(user: User): Promise<UserNotesStorage> {
    await this.assureInitialized(user);
    return JSON.parse(user.note);
  }

  static async setUserNotesObject(user: User, object: UserNotesStorage) {
    await user.setNote(JSON.stringify(object));
  }

  /**
   * Generates a default object into a users note if it's empty
   *
   * @static
   * @param {User} user
   * @memberof NoteStorageController
   */
  static async assureInitialized(user: User) {
    if (user.note === "") {
      await this.setUserNotesObject(user, { selectedGuild: null });
    }
  }
}

interface UserNotesStorage {
  selectedGuild: string;
}
