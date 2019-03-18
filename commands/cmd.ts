import * as cmd from "commander";
import { log } from "util";

// let st: string = "MB --init";
// let st: string = "MB -v";
let st: string = "MB -h";

let ret: string = "";

// log(st.split(" ").toString());

cmd
  .version("0.0.1", "-v, --version")
  .option("-i, --init", "Initialize ")
  .option("-c <cmdChannel>, --cmd <cmdChannel>", "Set the cmd channel to <cmdChannel>")
  .parse((" " + st).split(" "));

  ret = (cmd.init) ? "init it now" : "don't init it";

export default ret;