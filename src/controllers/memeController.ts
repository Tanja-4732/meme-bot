import { Message } from "discord.js";
import { getManager } from "typeorm";
import MemeMessage from "../models/memeMessage";
import GuildController from "./guildController";
import { GuildModel } from "../models/guildModel";
import Meme from "../commands/meme";

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

    await mgr.save(meme);
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

  static async getAllMemesOfGuild(guildModel: string): Promise<MemeMessage[]> {
    return await getManager().find(MemeMessage, { where: { guildModel } });
  }

  static async isMemeVideo(msg: Message): Promise<boolean> {
    const mgr = getManager();

    const videoMessage = await mgr.find(MemeMessage, {
      where: { videoMessageId: msg.id }
    });

    return videoMessage.length === 1;
  }
}
