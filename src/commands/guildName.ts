import { Message } from "discord.js";
import GuildController from "../controllers/guildController";
import SendMsg, { CmdStatus } from "../utils/sendMsg";

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
}
