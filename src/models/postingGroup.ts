import { Entity, Column, ManyToOne } from "typeorm";
import { Guild as GuildModel } from "./guildModel";

@Entity()
export default class PostingGroup {
  @ManyToOne()
  guildModel: GuildModel
}