import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import PostingGroup from "./postingGroup";

@Entity()
export class Guild {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  adminRoleId: string;

  @Column()
  cmdChannelId: string;

  @Column({nullable: true})
  confessionChannelId: string;

  @OneToMany(() => PostingGroup, postingGroup => postingGroup.guildModel)
  postingGroups: PostingGroup[];
}
