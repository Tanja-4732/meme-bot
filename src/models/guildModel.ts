import { Entity, PrimaryColumn, Column } from "typeorm";

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
}
