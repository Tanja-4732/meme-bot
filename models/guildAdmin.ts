import { Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Guild } from "./guildModel";

@Entity()
export class GuildAdmin {
  @PrimaryColumn()
  id: number;

  @ManyToOne(() => Guild, guild => guild.admins, { primary: true })
  guild: Guild;
}