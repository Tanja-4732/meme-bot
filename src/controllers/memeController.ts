import { Message } from "discord.js";
import { getManager } from "typeorm";
import MemeMessage from "../models/memeMessage";

export default class MemeController {
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
