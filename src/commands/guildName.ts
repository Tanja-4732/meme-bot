import { Message } from "discord.js";
import GuildController from "../controllers/guildController";
import SendMsg, { CmdStatus } from "../utils/sendMsg";
import { log } from "util";
import NoteStorageController from "../controllers/noteStorageController";

export default class GuildName {
  static async setGuildName(msg: Message, name: string) {
    if (await GuildController.setName(msg.guild, name)) {
      SendMsg.cmdRes({
        msg,
        status: CmdStatus.SUCCESS,
        text: "We've set the name successfully."
      });
    } else {
      SendMsg.cmdRes({
        msg,
        status: CmdStatus.ERROR,
        text: "We couldn't set the name.\nMaybe it's taken already"
      });
    }
  }

  static async printGuildName(msg: Message) {
    const name: string = await GuildController.getName(msg.guild);

    SendMsg.cmdRes({
      msg,
      status: CmdStatus.INFO,
      text:
        name == null
          ? "The name hasn't been set yet.\nPlease set one in order for the bot to work properly."
          : "The name is set to " + name
    });
  }

  static async setDM(msg: Message, guildName: string) {
    if (await GuildName.guildExists(guildName)) {
      await NoteStorageController.setGuild(msg.author, guildName);
      SendMsg.cmdRes({
        msg,
        status: CmdStatus.SUCCESS,
        text: "We've selected the server " + guildName
      });
    } else {
      SendMsg.cmdRes({
        msg,
        status: CmdStatus.ERROR,
        text: "We couldn't set the server.\nPlease check your spelling."
      });
    }
  }

  static async printDM(msg: Message) {}

  static async guildExists(guildName: string): Promise<boolean> {
    return null != (await GuildController.getGuildModelByName(guildName));
  }
}
