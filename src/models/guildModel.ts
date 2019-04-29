import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import PostingGroup from "./postingGroup";

@Entity()
export class GuildModel {
  /**
   * The Discord ID if the server
   *
   * @type {string}
   * @memberof GuildModel
   */
  @PrimaryColumn()
  id: string;

  /**
   * Used for quick identification in the database.
   * This might get deleted.
   *
   * @deprecated
   * @type {string}
   * @memberof GuildModel
   */
  @Column()
  name: string;

  /**
   * The role which a guild member must have to have the
   * commands sent to the bot be executed. Having the
   * administrator permission on the guild also works.
   *
   * @type {string}
   * @memberof GuildModel
   */
  @Column()
  adminRoleId: string;

  /**
   * The channel in which to listen for commands
   *
   * @type {string}
   * @memberof GuildModel
   */
  @Column({ nullable: true })
  cmdChannelId: string;

  /**
   * The text-channel in which to post user submitted
   * confessions anonymously. It can be disabled by
   * setting it to null.
   *
   * @type {string}
   * @memberof GuildModel
   */
  @Column({ nullable: true })
  confessionChannelId: string;

  // TODO allow for several meme channels #11 & #12
  @Column({nullable: true})
  memeChannelId: string;

  /**
   * The unique short handle to be used in DMs to specify a guild
   *
   * @type {string}
   * @memberof GuildModel
   */
  // @Column({ unique: true })
  // handle: string;

  @OneToMany(() => PostingGroup, postingGroup => postingGroup.guildModel)
  postingGroups: PostingGroup[];
}
