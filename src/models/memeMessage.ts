import { Entity, ManyToOne, Column } from "typeorm";
import { GuildModel } from "./guildModel";


/**
 * Represents a message sent by the bot to be tracked as a meme
 *
 * @export
 * @class MemeMessage
 */
@Entity()
export default class MemeMessage {
  @ManyToOne(() => GuildModel, gm => gm.memeMessages)
  guildModel: GuildModel;  

  @Column({primary: true})
  messageId: string;

  @Column({nullable: true})
  videoMessageId: string | null;
};
