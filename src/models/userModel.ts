import { Entity, Column } from "typeorm";

@Entity()
export default class UserModel {
  /**
   * The ID of this user assigned by discord
   *
   * @type {string}
   * @memberof UserModel
   */
  @Column({ primary: true })
  id: string;

  /**
   * The selected guild by its chosen id
   *
   * @type {string}
   * @memberof UserModel
   */
  @Column({ nullable: true })
  selectedGuild: string;
}
