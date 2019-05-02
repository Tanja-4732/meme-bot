import {
  Client,
  Message,
  RichEmbed,
  TextChannel,
  Role,
  Attachment,
  MessageAttachment
} from "discord.js";
import { log } from "util";
import request = require("request-promise-native");

export default class SendMsg {
  public static readonly questionMarkImageUrl =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Icon-round-Question_mark.svg/1024px-Icon-round-Question_mark.svg.png";

  /**
   * Sends an embed with a quote into the channel of the message, mentioning
   * the user who triggered it, using a code block for the contents.
   *
   * This is only meant to be used to reply to commands
   *
   * @static
   * @param {Message} msg The message from an event
   * @param {CmdStatus} status The status of the command executed (e.g. success)
   * @param {string} text The text to be displayed (in a code-block) (include a newline yourself)
   * @param {string} [title] The title of the embed
   * @param {string} [description] The description of the embed
   * @memberof SendMsg
   */
  public static cmdRes({
    msg,
    status,
    text,
    title,
    description
  }: {
    msg: Message;
    status: CmdStatus;
    text: string;
    title?: string;
    description?: string;
  }): void {
    /**
     * The RichEmbed to be sent into the channel
     */
    let re: RichEmbed = new RichEmbed()
      .setColor(this.getColorFromStatus(status))
      .setTitle(title || "")
      .setAuthor(msg.author.username, msg.author.avatarURL)
      .setDescription(msg.author.toString() || "")
      .addField(status, "```\n" + text + "```")
      .setTimestamp()
      .setFooter(this.getQuote());

    // Send the RichEmbed into the target channel
    msg.channel.send(re);
  }

  /**
   * Post a confession message to the specified channel
   *
   * It will be colored according to the role of the user
   * who requested its posting. The user will remain remain
   * anonymous. An image can be specified.
   */
  public static confession({
    channel,
    groupRole,
    text,
    age,
    imageUrl
  }: {
    channel: TextChannel;
    groupRole?: Role;
    text: string;
    age?: number;
    imageUrl?: string;
  }) {
    // TODO remove this
    /**
     * The RichEmbed to be sent into the channel
     */
    let re: RichEmbed = new RichEmbed()
      .setColor(groupRole.color || "82368c")
      .setAuthor(
        age == null ? groupRole.name : groupRole.name + " (" + age + ")",
        imageUrl || this.questionMarkImageUrl
      )
      .addField("Confession", "```\n" + text + "```")
      .setTimestamp()
      .setFooter(this.getQuote());

    // Send the RichEmbed into the target channel
    channel.send(re);
  }

  static async meme({
    channel,
    attachment,
    msg,
    attribution
  }: {
    channel: TextChannel;
    attachment: MessageAttachment;
    msg: Message;
    attribution: boolean;
  }): Promise<void> {
    const authorAsMember = channel.guild.members.find(
      member => member.id === msg.author.id
    );

    const isVideo: boolean = attachment.filename.endsWith(".mp4");

    let re: RichEmbed = new RichEmbed()
      .setColor(authorAsMember.colorRole.color || "82368c")

      .setImage(attachment.url)
      .setTimestamp()
      .setFooter(this.getQuote());

    if (attribution) {
      re.setAuthor(
        authorAsMember.displayName,
        authorAsMember.user.displayAvatarURL
      ).setDescription("We've put the video above.");
    } else {
      re.setAuthor("Anonymous");
    }

    // Send the RichEmbed into the target channel

    if (isVideo) {
      channel.send({
        files: [attachment.url]
      });
    }

    const postedMeme = ((await channel.send(re)) as unknown) as Message;

    postedMeme.react("👍");
    postedMeme.react("👎");
  }

  /**
   * Gets the color for the embeds border based on a status
   *
   * @private
   * @static
   * @param {CmdStatus} status The status of an executed command
   * @returns {string} The hex color string with a hash before it
   * @memberof SendMsg
   */
  private static getColorFromStatus(status: CmdStatus): string {
    switch (status) {
      case CmdStatus.SUCCESS:
        return "#22b14c";
      case CmdStatus.INFO:
        return "#42a5f5";
      case CmdStatus.WARNING:
        return "#e7c000";
      case CmdStatus.ERROR:
        return "#cc0000";
    }
  }

  /**
   * Get a randomly selected quote
   *
   * @private
   * @static
   * @returns {string} A randomly selected quote
   * @memberof SendMsg
   */
  private static getQuote(): string {
    /**
     * The quotes array
     *
     * The array is read in from a global variable MB_QUOTES,
     * which is set at startup.
     */
    const quotes: string[] = JSON.parse(process.env.MB_QUOTES);

    /**
     * The index to be retrieved from the quotes array
     */
    const randomIndex = Math.floor(Math.random() * (quotes.length - 1));
    // Return the randomly selected quote
    return quotes[randomIndex];
  }

  /**
   * Fetches the quotes
   *
   * @memberof SendMsg
   */
  public static async fetchQuotes(): Promise<void> {
    let response: string = "";
    try {
      response = await request(
        "https://gist.githubusercontent.com/Bernd-L/0dfeb697c7dbadd01c3cc9e606e812b5/raw/03638b3ec79f963f14e87b88c951540bf57cf376/quotes.json"
      );
    } catch (error) {
      log("Error while fetching quotes:\n" + error);
    }
    process.env.MB_QUOTES = response;
    log("Fetched quotes");
    return;
  }
}

export enum CmdStatus {
  SUCCESS = "success",
  INFO = "info",
  WARNING = "warning",
  ERROR = "error"
}
