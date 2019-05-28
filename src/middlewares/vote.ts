import { MessageReaction, User } from "discord.js";
import MemeController from "../controllers/memeController";
import { log } from "util";

export default class Vote {
  /**
   * Processes a reaction given its context
   *
   * @static
   * @param {MessageReaction} mr
   * @param {User} user
   * @memberof Vote
   */
  static async useReaction(mr: MessageReaction, user: User) {
    // Check if the message is a meme
    const meme = await MemeController.getMeme(mr.message);
    if (meme != null) {
      // Keep up/downvotes form each other
      switch (mr.emoji.name) {
        case "👍":
          // Remove the users downvote
          mr.message.reactions
            .find(
              (mr: MessageReaction): boolean => {
                return mr.emoji.name === "👎";
              }
            )
            .remove(user);
          return;
        case "👎":
          // Remove the users upvote
          mr.message.reactions
            .find(
              (mr: MessageReaction): boolean => {
                return mr.emoji.name === "👍";
              }
            )
            .remove(user);
          return;
      }
    }

    // Keep videos clear from reactions
    if (await MemeController.isMemeVideo(mr.message)) {
      mr.message.clearReactions();
    }
  }
}
