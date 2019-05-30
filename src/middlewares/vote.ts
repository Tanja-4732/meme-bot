import { MessageReaction, User } from "discord.js";
import MemeController from "../controllers/memeController";
import { log } from "util";
import GuildController from "../controllers/guildController";

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

          // Get the downvote limit
          const downvoteLimit = await GuildController.getDownvoteLimit(
            mr.message.guild
          );

          // Check for downvote limit
          if (downvoteLimit != null && downvoteLimit < mr.count - 1) {
            // Remove the accompanying video, if one exists
            if (meme.videoMessageId != null) {
              mr.message.channel.messages
                .find(msg => msg.id == meme.videoMessageId)
                .delete();
            }

            // Delete the message itself
            mr.message.delete();

            // Remove the meme from the db
            MemeController.removeMeme(meme);
            return;
          }
      }
    }

    // Keep videos clear from reactions
    if (await MemeController.isMemeVideo(mr.message)) {
      mr.message.clearReactions();
    }
  }
}
