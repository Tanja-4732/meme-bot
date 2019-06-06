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
    const messageLimit = 1024 - (3 * 2 + 1);

    const textArray: string[] = [];

    // Split the message in multiple parts
    do {
      textArray.push("```\n" + text.substr(0, messageLimit) + "```");
      text = text.substr(1 + messageLimit);
    } while (text.length !== 0);

    /**
     * The RichEmbed to be sent into the channel
     */
    let re: RichEmbed = new RichEmbed()
      .setColor(this.getColorFromStatus(status))
      .setTitle(title || "")
      .setAuthor(msg.author.username, msg.author.avatarURL)
      .setDescription(
        msg.author.toString() +
          // Append a parted-notice to the description of the RichEmbed, if it exceeds the limit
          (textArray.length === 1
            ? ""
            : "\n\nThis message exceeds Discords limit.\nIt will be split into several blocks.")
      )
      .setTimestamp()
      .setFooter(this.getQuote());

    // Append all of the text to the RichEmbed
    for (let i = 0; i < textArray.length; i++) {
      re.addField(
        status +
          // If there are several parts, indicate them accordingly
          (textArray.length > 1
            ? " (" + (i + 1) + "/" + textArray.length + ")"
            : ""),
        textArray[i]
      );
    }

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

  /**
   * Posts a formatted meme into a channel and creates a second message to host
   * a video attachment, if required. Both of the messages will be returned in
   * an array, leading with the meme itself, the video thereafter, if not null.
   *
   * The name of the author gets resolved using the msg parameter. It expects
   * the message, which contained the original command.
   *
   * @static
   * @returns {(Promise<[Message, null | Message]>)} An array with the meme
   * itself at index 0 and the video message (or null) at index 1
   * @memberof SendMsg
   */
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
  }): Promise<[Message, null | Message]> {
    const authorAsMember = channel.guild.members.find(
      member => member.id === msg.author.id
    );

    const isVideo: boolean =
      attachment.filename.endsWith(".mp4") ||
      attachment.filename.endsWith(".mov");

    let re: RichEmbed = new RichEmbed()
      .setColor(
        authorAsMember.colorRole == null
          ? "82368c"
          : authorAsMember.colorRole.color
      )

      .setImage(attachment.url)
      .setTimestamp()
      .setFooter(this.getQuote());

    if (attribution) {
      // Add attribution when requested for
      re.setAuthor(
        authorAsMember.displayName,
        authorAsMember.user.displayAvatarURL
      );
    } else {
      // Declare the post as anonymous, when attribution is requested against
      re.setAuthor("Anonymous");
    }

    // The video message
    let video: Message | null;

    if (isVideo) {
      // Set the video-info, so the message isn't empty
      re.setDescription("We've put the video above.");

      // Send the video first
      video = ((await channel.send({
        files: [attachment.url]
      })) as unknown) as Message;
    }

    // Send the RichEmbed into the target channel
    const meme = ((await channel.send(re)) as unknown) as Message;

    // Return the message and the video, if one exists
    return [meme, video];
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
