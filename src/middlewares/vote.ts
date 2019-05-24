import { MessageReaction, User } from "discord.js";
import MemeController from "../controllers/memeController";
import { log } from "util";

export default class Vote {
  static useReaction(messageReaction: MessageReaction, user: User) {
    // Check if the message is a meme
    const meme = MemeController.getMeme(messageReaction.message);
    if (meme != null) {
      // Keep up/downvotes form each other
      switch (messageReaction.emoji.name) {
        case "👍":
          log("up");
          // Remove the users downvote
          messageReaction.message.reactions
            .find(
              (mr: MessageReaction): boolean => {
                return mr.emoji.name === "👎";
              }
            )
            .remove(user);
          break;
        case "👎":
          log("down");
          break;
      }
    }
  }
}
