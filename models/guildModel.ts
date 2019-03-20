import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { GuildAdmin } from "./guildAdmin";

@Entity()
export class Guild {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => GuildAdmin, guildAdmin => guildAdmin.guild)
  admins: GuildAdmin[];

  @Column()
  adminRoleId: number;

  @Column()
  cmdChannelId: number
}
