import { User } from "discord.js";

export default class NoteStorageController {
  static setGuild(user: User, guildName: string) {
    const userNotes = this.getUserNotesObject(user);
    userNotes.selectedGuild = guildName;
    this.setUserNotesObject(user, userNotes);
  }

  static getUserNotesObject(user: User): UserNotesStorage {
    return JSON.parse(user.note);
  }

  static async setUserNotesObject(user: User, object: UserNotesStorage) {
    await user.setNote(JSON.stringify(object));
  }
}

interface UserNotesStorage {
  selectedGuild: string;
}
