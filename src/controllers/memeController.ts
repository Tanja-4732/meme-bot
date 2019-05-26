import { Message } from "discord.js";
import { getManager } from "typeorm";
import MemeMessage from "../models/memeMessage";
import GuildController from "./guildController";
import { GuildModel } from "../models/guildModel";

export default class MemeController {
  /**
   * Registers a meme in the db
   *
   * @static
   * @param {Message[]} memeArray
   * @memberof MemeController
   */
  static async add(memeArray: Message[]) {
    const mgr = getManager();

    const meme: MemeMessage = new MemeMessage();

    meme.guildModel = await mgr.findOne(GuildModel, memeArray[0].guild.id);
    meme.messageId = memeArray[0].id;
    meme.videoMessageId = memeArray[1] == null ? null : memeArray[1].id;

    await mgr.save<MemeMessage>(meme);
  }

  /**
   * Gets the messages' meme representation (if any) from the db
   *
   * @static
   * @param {Message} msg
   * @returns {Promise<boolean>}
   * @memberof MemeController
   */
  static async getMeme(msg: Message): Promise<MemeMessage> {
    const mgr = getManager();

    const result = await mgr.findOne(MemeMessage, msg.id);

    return result;
  }
}
