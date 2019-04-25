import { Entity, Column, ManyToOne } from "typeorm";
import { Guild as GuildModel } from "./guildModel";

@Entity()
export default class PostingGroup {
  @ManyToOne(() => GuildModel, guildModel => guildModel.postingGroups, {
    primary: true
  })
  guildModel: GuildModel;

  @Column({ primary: true })
  roleId: string;
}
