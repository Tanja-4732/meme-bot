import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class Guild {
  @PrimaryColumn("bigint")
  id: number;

  @Column()
  name: string;

  @Column("bigint")
  adminRoleId: number;

  @Column("bigint")
  cmdChannelId: number;
}
