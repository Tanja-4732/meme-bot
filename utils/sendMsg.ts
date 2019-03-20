import { Client, Message, RichEmbed } from "discord.js";
import { log } from "util";
import request = require("request-promise-native");

export default class SendMsg {
  /**
   * Sends an embed with a quote into the channel of the message, mentioning
   * the user who triggered it, using a code block for the contents.
   *
   * This is only meant to be used to reply to commands
   *
   * @static
   * @param {Client} bot The discord.js Client
   * @param {Message} msg The message from an event
   * @param {CmdStatus} status The status of the command executed (e.g. success)
   * @param {string} text The text to be displayed (in a code-block) (include a newline yourself)
   * @param {string} [title] The title of the embed
   * @param {string} [description] The description of the embed
   * @memberof SendMsg
   */
  public static cmdRes(
    bot: Client,
    msg: Message,
    status: CmdStatus,
    text: string,
    title?: string,
    description?: string
  ): void {
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
