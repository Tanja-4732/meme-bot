import { MessageReaction, User } from "discord.js";
import MemeController from "../controllers/memeController";

export default class Vote {
  static useReaction(messageReaction: MessageReaction, user: User) {
    // Check if the message is a meme
    const meme = MemeController.getMeme(messageReaction.message);
    if (meme != null) {
      // Keep up/downvotes form each other
      if (messageReaction.emoji)
    }
  }
}
