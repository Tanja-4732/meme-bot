import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { GuildAdmin } from "./guildAdmin";

@Entity()
export class Guild {
  @PrimaryColumn("bigint")
  id: number;

  @Column()
  name: string;

  @OneToMany(() => GuildAdmin, guildAdmin => guildAdmin.guild)
  admins: GuildAdmin[];

  @Column("bigint")
  adminRoleId: number;

  @Column("bigint")
  cmdChannelId: number
}
