import { MessageReaction, User } from "discord.js";

export default class Vote {
  static useReaction(messageReaction: MessageReaction, user: User) {
    // Check if the message is a meme
    if (MemeController.isMeme(messageReaction.message)) {
      // Keep up/downvotes form each other
      
      
    }
  }
}
