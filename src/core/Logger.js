import { Runtime } from "@src/core/Runtime";
import { tokenize } from "@src/utils/tokenize";

export const LOGLEVELS = {
  DEBUG: 10,
  INFO: 20,
  SUCCESS: 25,
  WARNING: 30,
  ERROR: 40,
  CRITICAL: 50,
}

export const LOGLEVELS_asstring = {
  [LOGLEVELS.DEBUG]: "debug",
  [LOGLEVELS.INFO]: "info",
  [LOGLEVELS.SUCCESS]: "success",
  [LOGLEVELS.WARNING]: "warning",
  [LOGLEVELS.ERROR]: "error",
  [LOGLEVELS.CRITICAL]: "critical",
}

// This is used only for console.log calls
const LOGLEVELS_ascolor = {
  [LOGLEVELS.DEBUG]: { color: "gray", bg: "", },
  [LOGLEVELS.INFO]: { color: "#007bff", bg: "", },
  [LOGLEVELS.SUCCESS]: { color: "#28a745", bg: "", },
  [LOGLEVELS.WARNING]: { color: "#fd7e14", bg: "", },
  [LOGLEVELS.ERROR]: { color: "#dc3545", bg: "", },
  [LOGLEVELS.CRITICAL]: { color: "#dc3545", bg: "black", },
}

export class Logger {
  constructor() {
    if(!!Logger.instance) {
      return Logger.instance;
    }

    // This is used to store all messages
    this.msgs = [];

    // This is used by the log viewer and includes only messages that should be
    // visible while taking into account the log level, the log filter, etc...
    this.filteredMsgs = [];

    // An array that will hold the position (index) of all the messages in the
    // "filteredMsgs" array that match the search filter
    this.searchMatches = [];

    this._id_count = 0;

    Logger.instance = this;

    this._rawMode = false;
    this._rawModePointer = 0;
    this._rawModePointers = {};

    this.runtime = new Runtime();
  }

  _normalizeMsg(msgs) {
    return {
      text: msgs.map(msg => {
        switch (typeof msg) {
          case "string":
            return msg;
          case "object":
            if(msg instanceof Error) {
              return `${msg.message}\n${msg.stack}`;
            } else {
              return JSON.stringify(msg, null, 2);
            }
          default:
            return "";
        }
      }).join(" "),
    };
  }

  _triggerLogActivity() {
    const eb = this.runtime.get("objects.eventBus");
    if(eb) {
      eb._rawPublish("LogActivity");
    }
  }

  _commitMsg(msg) {
    let msgs = msg.text.split("\n");

    // We must check if we're in raw mode. If we are it means that we're
    // receiving messages that might be the continuation of a previous message
    // that we already rendered. We must check if the _rawModePointer is in the
    // hashmap of _rawModePointers and, if it is, get it's value. That value is
    // the index of the message we should update.
    if(this._rawMode && this._rawModePointer in this._rawModePointers) {
      const msg_idx = this._rawModePointers[this._rawModePointer];
      msgs[0] = this.msgs[msg_idx].text + msgs[0];
    }

    const lines = msgs.map((t, i) => {
      const line = {
        id: this.getID(),
        time: this.getTimestamp(),
        level: msg.level,
        level_str: LOGLEVELS_asstring[msg.level],
        partial: i != 0,
        text: t,
        html: null,
      };

      // Maybe add .html field?
      const tokenized = tokenize(line.text);
      if(tokenized) {
        line.html = <div>{tokenized.map((chunk, idx) => {
          if(typeof chunk == "string") return chunk;

          switch (chunk.type) {
            // case "url":
            //   return <span key={idx} className="clickable" onClick={() => {
            //     this.runtime.get("objects.eventBus").publish("LoglineChunkClick", chunk);
            //   }}>{chunk.text}</span>

            case "uuid":
              return <span key={idx} className="clickable" onClick={() => {
                this.runtime.get("objects.eventBus").publish("LoglineChunkClick", chunk);
              }}>{chunk.text}</span>

            case "void":
              return chunk.text;

            default:
              return "";
          }
        })}</div>;
      }

      return line;
    });

    // If we're in raw mode and the _rawModePointer is in the _rawModePointers
    // hashmaps, then the first element in the "lines" array should be used to
    // update the message at the msg_idx index, in the this.msgs array.
    if(this._rawMode && this._rawModePointer in this._rawModePointers) {
      const msg = lines.shift();
      const msg_idx = this._rawModePointers[this._rawModePointer];

      this.msgs[msg_idx].text = msg.text;
      this.msgs[msg_idx].html = msg.html;
    }

    // Maybe "msgs" contained a single string? This might happen when the CLI
    // sent us a raw message without a \n at the end
    if(lines.length > 0) {
      this.msgs.push(...lines);
    }

    // If we're in raw mode and the last element in the "lines" array end with
    // "\n" we must delete the _rawModePointer from the _rawModePointers
    // hashmap. But if it doesn't, we must create it or update it.
    if(this._rawMode) {
      if(this.msgs[this.msgs.length - 1].text.endsWith("\n")) {
        delete this._rawModePointers[this._rawModePointer];
      } else {
        // We must update the pointer position only if we actually added more
        // than one line.
        if(lines.length > 0) {
          this._rawModePointers[this._rawModePointer] = this.msgs.length - 1;
        }
      }
    }

    const gconfig = this.runtime.get("objects.gconfig");
    let fmt = process.env.CONSOLE_COLORS;
    let fmt_text = !fmt ? msg.text : `%c${msg.text}`;
    let fmt_colors = `
      color: ${LOGLEVELS_ascolor[msg.level].color};
      background-color: ${LOGLEVELS_ascolor[msg.level].bg};
    `;
    if(gconfig) {
      if(gconfig.get("core.logging.logLevel") <= msg.level) {
        !fmt ? console.log(fmt_text) : console.log(fmt_text, fmt_colors);
      }
    } else {
      !fmt ? console.log(fmt_text) : console.log(fmt_text, fmt_colors);
    }
  }

  updateLogView() {
    const gconfig = this.runtime.get("objects.gconfig");
    const logLevel = gconfig?.get?.("core.logging.logLevel") || 0;
    const logFilter = this.runtime.get("state.logging.logFilter");

    this.filteredMsgs = [];
    this.searchMatches = [];

    let pos = 0;
    this.filteredMsgs = this.msgs.reduce((acc, msg) => {
      // We want to see only the messages that are above the logLevel filter
      // Eg, we don't want to see "debug messages" (level 10) if the logLevel is
      // set to "info messages" (level 40).
      if(msg.level < logLevel) return acc;

      // If there is a filter...
      if(logFilter) {
        // ... and the messages contains the search term...
        if(msg.text.toLowerCase().indexOf(logFilter.toLowerCase()) > -1) {
          // ... store the position of the message
          this.searchMatches.push(pos);
        }
      }

      pos++;
      acc.push(msg);

      return acc;
    }, []);

    this._triggerLogActivity();
  }

  _partialUpdateLogView() {
    const gconfig = this.runtime.get("objects.gconfig");
    const logLevel = gconfig?.get?.("core.logging.logLevel") || 0;
    const logFilter = this.runtime.get("state.logging.logFilter");

    const lastMsg = this.filteredMsgs.at(-1);
    let ptr = 0;
    if(lastMsg) {
      ptr = this.msgs.findIndex(msg => msg.id > lastMsg.id);

      // There are no new messages that we should push to the filteredMsgs array
      if(ptr === -1) return;
    }

    for (let index = ptr; index < this.msgs.length; index++) {
      const msg = this.msgs[index];

      if(msg.level < logLevel) continue;

      this.filteredMsgs.push(msg);

      // If there is a filter...
      if(logFilter) {
        // ... and the messages contains the search term...
        if(msg.text.toLowerCase().indexOf(logFilter.toLowerCase()) > -1) {
          // ... store the position of the message
          this.searchMatches.push(this.filteredMsgs.length - 1);
        }
      }
    }
  }

  clear() {
    this.msgs.splice(0, this.msgs.length);
    this.filteredMsgs.splice(0, this.filteredMsgs.length);
    this.searchMatches.splice(0, this.searchMatches.length);
    this.unsetRawMode();
    this.clearRawModePointers();
    this._triggerLogActivity();
  }

  getID() {
    const id = this._id_count;
    this._id_count++;
    return id;
  }

  getTimestamp() {
    const now = new Date();
    let h = now.getHours();
    h = h < 10 ? `0${h}` : h;
    let m = now.getMinutes();
    m = m < 10 ? `0${m}` : m;
    let s = now.getSeconds();
    s = s < 10 ? `0${s}` : s;

    return `${h}:${m}:${s}`;
  }

  getLoggerForLevel(level) {
    const levels = {
      0: this.log.bind(this),
      10: this.debug.bind(this),
      20: this.info.bind(this),
      30: this.warn.bind(this),
      40: this.error.bind(this),
      50: this.critical.bind(this),
    }

    return levels[level] || this.log.bind(this);
  }

  setRawMode(thread_id) {
    this._rawMode = true;
    this._rawModePointer = thread_id;
  }

  unsetRawMode() {
    this._rawMode = false;
    this._rawModePointer = null;
  }

  clearRawModePointers() {
    this._rawModePointers = {};
  }

  log(...msg) {
    msg = this._normalizeMsg(msg);
    msg.level = LOGLEVELS.DEBUG;
    this._commitMsg(msg);
    this._partialUpdateLogView();
    this._triggerLogActivity();
  }

  debug(...msg) {
    msg = this._normalizeMsg(msg);
    msg.level = LOGLEVELS.DEBUG;
    this._commitMsg(msg);
    this._partialUpdateLogView();
    this._triggerLogActivity();
  }

  info(...msg) {
    msg = this._normalizeMsg(msg);
    msg.level = LOGLEVELS.INFO;
    this._commitMsg(msg);
    this._partialUpdateLogView();
    this._triggerLogActivity();
  }

  success(...msg) {
    msg = this._normalizeMsg(msg);
    msg.level = LOGLEVELS.SUCCESS;
    this._commitMsg(msg);
    this._partialUpdateLogView();
    this._triggerLogActivity();
  }

  warn(...msg) {
    msg = this._normalizeMsg(msg);
    msg.level = LOGLEVELS.WARNING;
    this._commitMsg(msg);
    this._partialUpdateLogView();
    this._triggerLogActivity();
  }

  error(...msg) {
    msg = this._normalizeMsg(msg);
    msg.level = LOGLEVELS.ERROR;
    this._commitMsg(msg);
    this._partialUpdateLogView();
    this._triggerLogActivity();
  }

  critical(...msg) {
    msg = this._normalizeMsg(msg);
    msg.level = LOGLEVELS.CRITICAL;
    this._commitMsg(msg);
    this._partialUpdateLogView();
    this._triggerLogActivity();
  }
}
