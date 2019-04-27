/**
 * Contains specialized string operations this application depends on.
 *
 * @export
 * @class StringUtils
 */
export default class StringUtils {
  /**
   * Converts a string to an argv-like array.
   * Just like a shell would.
   *
   * Supports double-quoted strong quotes. Escaped double quotes inside of
   * double-quoted strings are considered as literals and will be replaced
   * with a double quote. Single quotes are considered literals like any
   * regular text character.
   *
   * @static
   * @param {string} s The string to be parsed
   * @returns {string[]} The argv-like array
   * @memberof StringUtils
   */
  public static toArgv(s: string): string[] {
    const regex = /(?:(?<=")(?:[^\n])+?(?=")(?<!\\))|[^ \n"]+/g;

    let m;
    let r: string[] = [];

    while ((m = regex.exec(s)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      // The result can be accessed through the `m`-variable.
      r = r.concat(m);
    }

    return r.map(v => {
      return v.replace(/\\"/g, '"');
    });
  }
}

// const str = `mb conf "Hello there: \\"Hello\\"" --age 18`;
// console.log(StringUtils.toArgv(str));
