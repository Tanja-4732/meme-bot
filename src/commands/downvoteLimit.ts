import { Message } from "discord.js";
import GuildController from "../controllers/guildController";
import SendMsg, { CmdStatus } from "../utils/sendMsg";

export default class DownvoteLimit {
  static async setDownvoteLimit(
    msg: Message,
    downvoteLimit: number
  ): Promise<void> {
    try {
      await GuildController.setDownvoteLimit(msg.guild, downvoteLimit);
      SendMsg.cmdRes({
        msg,
        status: CmdStatus.SUCCESS,
        text: "We've successfully set the downvote limit to " + downvoteLimit
      });
    } catch (error) {
      SendMsg.cmdRes({
        msg,
        status: CmdStatus.ERROR,
        text: "We couldn't set the downvote limit.\nThat's all we know."
      });
    }
  }
  static async removeDownvoteLimit(msg: Message): Promise<void> {
    try {
      await GuildController.removeDownvoteLimit(msg.guild);
      SendMsg.cmdRes({
        msg,
        status: CmdStatus.SUCCESS,
        text: "We've successfully disabled the downvote limit. "
      });
    } catch (error) {
      SendMsg.cmdRes({
        msg,
        status: CmdStatus.ERROR,
        text: "We couldn't disable the downvote limit.\nThat's all we know."
      });
    }
  }
  static async printDownvoteLimit(msg: Message): Promise<void> {
    try {
      const downvoteLimit = await GuildController.getDownvoteLimit(msg.guild);
      SendMsg.cmdRes({
        msg,
        status: CmdStatus.INFO,
        text:
          "The downvote limit is " +
          (downvoteLimit == null ? "disabled." : "set to " + downvoteLimit)
      });
    } catch (error) {
      SendMsg.cmdRes({
        msg,
        status: CmdStatus.ERROR,
        text: "We couldn't print the downvote limit.\nThat's all we know."
      });
    }
  }
}
