import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { GuildAdmin } from "./guildAdmin";

@Entity()
export class Guild {
  @PrimaryColumn()
  id: number;

  @Column()
  guildName: string;

  @OneToMany(() => GuildAdmin, guildAdmin => guildAdmin.guild)
  admins: GuildAdmin[];

  @Column()
  adminRoleId: number;

  @Column()
  cmdChannelId: number
}
