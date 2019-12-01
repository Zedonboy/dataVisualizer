import * as React from "react";
import * as Xterm from "xterm";
import { IPlotData } from "./RenderView";
interface IConsole {
  onClear : () => void
  onCreateChart : (pd : IPlotData) => void
}
export default class Console extends React.PureComponent<IConsole> {
  private curr_line = "";
  private statement = "";
  render() {
    return (
      <div
        id="terminal-container"
        style={{
          width: "100%",
          height: "30%",
          resize: "vertical"
        }}
      >
        <div id="terminal" />
      </div>
    );
  }

  consolePlot(type : string, x : any[], y:any[]) {
    let pD = new IPlotData()
    pD.type = type
    pD.x = x
    pD.y = y
    this.props.onCreateChart(pD)
    return "OK";
  }

  clearPlots() {
    this.props.onClear()
    return "OK"
  }

  clearConsole(term: Xterm.Terminal) {
    term.clear();
    this.clearLine(term);
    term.write("\x1b[;1;34m >|\x1b[0m");
  }

  clearLine(term: Xterm.Terminal) {
    term.write("\x1b[2K\r");
  }

  newLine(term: Xterm.Terminal, data?: string) {
    if (data && data.length > 0) {
      term.write(data);
    } else {
      term.write("\r\n\x1b[;1;34m >|\x1b[0m");
    }
  }

  componentDidMount() {
    let term = new Xterm.Terminal();
    term.open(document.getElementById("terminal"));
    this.newLine(term, "\x1b[;1;34m >|\x1b[0m");
    term.onKey(e => {
      const printable =
        !e.domEvent.altKey &&
        !e.domEvent.ctrlKey &&
        !e.domEvent.metaKey &&
        //@ts-ignore
        !e.domEvent.altGraphKey;
      switch (e.domEvent.code) {
        case "Enter":
          if (e.domEvent.shiftKey) {
            this.clearLine(term);
            term.write(`\x1b[;1;32m...\x1b[0m ${this.curr_line}`);
            this.newLine(term);
            this.statement += this.curr_line + ";";
            this.curr_line = "";
            break;
          }
          this.curr_line = this.curr_line.trim();
          if(this.curr_line.length == 0) {
            this.newLine(term)
            break
          }
          try {
            let result = Function(
              "plotFunc",
              "clearCharts",
              "clear",
              `${this.statement}return ${this.curr_line}`
            )(
              this.consolePlot.bind(this),
              this.clearPlots.bind(this),
              this.clearConsole.bind(this, term)
            );
            if (result) {
              term.write(`\r\n\x1b[;1;32m ${result} \x1b[0m`);
              this.newLine(term);
            }
          } catch (error) {
            try {
              let result = Function(
                "plotFunc",
                "clearCharts",
                "clear",
                `${this.curr_line}`
              )(
                this.consolePlot.bind(this),
                this.clearPlots.bind(this),
                this.clearConsole.bind(this, term)
              );
              if (result) {
                term.write(`\r\n\x1b[;1;32m ${result} \x1b[0m`);
                this.newLine(term);
              } else {
                this.newLine(term)
              }
            } catch (error) {
              term.write(`\r\n \x1b[;1;31m ${error.message} \x1b[0m`);
              this.newLine(term)
            }
          } finally {
            this.curr_line = "";
          }
          break;
        case "Backspace":
          if (term.buffer.cursorX > 3) {
            term.write("\b \b");
            this.curr_line = this.curr_line.substring(
              0,
              this.curr_line.length - 1
            );
          }
          break;
        case "Tab":
          term.write("\t");
          break;
        case "ArrowUp":
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":
          break;
        default:
          if (printable) {
            this.curr_line += e.key;
            term.write(e.key);
          }
          break;
      }
    });
    term.resize(100, 11);
  }
}
