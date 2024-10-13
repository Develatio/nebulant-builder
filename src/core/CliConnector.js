import { v4 as uuidv4 } from "uuid";
import semverGt from "semver/functions/gt";

import Url from "@src/utils/domurl";
import { Logger } from "@src/core/Logger";
import { Runtime } from "@src/core/Runtime";
import { GConfig } from "@src/core/GConfig";
import { EventBus } from "@src/core/EventBus";
import { DiagramQL } from "@src/data/DiagramQL";
import { TransparentProxy } from "@src/core/TransparentProxy";

import { isSafari } from "@src/utils/isSafari";

export const CliEventStates = {
  STARTED_PROCESSING_BP: 4, // Started processing the BP
  FINISHED_PROCESSING_BP: 5, // Finished processing the BP
  ERROR_PROCESSING_BP: 6, // Error while processing the BP
  STARTING_MANAGER: 7, // Manager is starting
  RESUMING_MANAGER: 8, // Manager is resuming
  STARTED_MANAGER: 9, // Manager is started
  PAUSING_MANAGER: 10, // Manager is pausing
  PAUSED_MANAGER: 11, // Manager is paused
  STOPPING_MANAGER: 12, // Manager is stopping
  FINISHED_EXECUTING_BG: 13, // Finished executing the BP
  // 14 ???
  WAITING_FOR_STATE: 15, // We're waiting for the CLI to tell us it's real state
  UNHANDLED_ACTION_ERROR: 16, // An action emitted an unhandled error
}

export const CliConnectorStates = {
  disconnected: 0,
  connecting: 1,
  connected: 2,
  waiting: 3,
  running: 4,
  paused: 5,
  pausing: 6,
  stopping: 7,
  waiting_for_cli_state: 8,
};

const CLI_STATE_2_CONNECTIVITY_STATE = {
  [CliEventStates.STARTED_PROCESSING_BP]: CliConnectorStates.waiting,
  [CliEventStates.FINISHED_PROCESSING_BP]: CliConnectorStates.waiting,
  [CliEventStates.ERROR_PROCESSING_BP]: CliConnectorStates.connected,
  [CliEventStates.STARTING_MANAGER]: CliConnectorStates.waiting,
  [CliEventStates.RESUMING_MANAGER]: CliConnectorStates.running,
  [CliEventStates.STARTED_MANAGER]: CliConnectorStates.running,
  [CliEventStates.PAUSING_MANAGER]: CliConnectorStates.pausing,
  [CliEventStates.PAUSED_MANAGER]: CliConnectorStates.paused,
  [CliEventStates.STOPPING_MANAGER]: CliConnectorStates.stopping,
  [CliEventStates.FINISHED_EXECUTING_BG]: CliConnectorStates.connected,
  //
  [CliEventStates.WAITING_FOR_STATE]: CliConnectorStates.waiting_for_cli_state,
  [CliEventStates.UNHANDLED_ACTION_ERROR]: CliConnectorStates.connected,
}

export class CliConnector {
  constructor() {
    if(!!CliConnector.instance) {
      return CliConnector.instance;
    }

    this.logger = new Logger();
    this.gconfig = new GConfig();
    this.runtime = new Runtime();
    this.eventBus = new EventBus();
    this.url = new Url();

    // We will use this to decode messages sent from the CLI
    this.decoder = new TextDecoder(); // default is utf-8

    this.proxy = new TransparentProxy();
    this.proxy.onClose = () => this.disconnect();
    this.proxy.onWebSocketOpen = evt => this.onWebSocketOpen(evt);
    this.proxy.onWebSocketClose = evt => this.onWebSocketClose(evt);
    this.proxy.onWebSocketError = err => this.onWebSocketError(err);
    this.proxy.onWebSocketMessage = evt => this.onWebSocketMessage(evt);

    // This uuid will be used by the CLI in every message that
    // it will send us back so we can know which events should we ignore
    // in case we have more than 1 open tab at the same time
    this.url.query.execution_uuid = this.url.query.execution_uuid || uuidv4();
    window.history.replaceState(null, null, `?${this.url.query}`);
    this.execution_uuid = this.url.query.execution_uuid;

    // We'll find out this if/when the CLI get's connected
    this.cli_version = null;

    this.logger.debug("Creating CLI connector.");

    CliConnector.instance = this;

    this.ws_conn = null;
    this.timeout_connect = null;
    this.state = CliConnectorStates.disconnected;

    this.current_host = ""; // We're using this for the status bar
    this.connection_attempts = 0;

    if(this.gconfig.get("cli.auto_connect")) {
      this.logger.info("'Auto connect' is ON, starting CLI connection attemps...");
      this.connect();
    }

    return this;
  }

  _setConnectivityState(state) {
    if(this.state == state || state == undefined) return;

    this.state = state;
    this.eventBus.publish("ConnectivityStateChanged", {
      state,
    });

    if(state <= CliConnectorStates.connected) {
      const engine = this.runtime.get("objects.engine");
      const dql = new DiagramQL();

      dql.query(`nodes | find: {
        "attributes.running": {
          "$eq": true
        }
      }`)?.forEach(node => {
        node.prop("running", false, { skip_undo_stack: true });
        engine.unHighlightOne(node);
      });
    }

    this.logger.debug(`CLI connectivity state: ${state}.`);
  }

  connect() {
    const retry_ms = this.gconfig.get("cli.retry_ms");
    const timeout_ms = this.gconfig.get("cli.timeout_ms");
    const cli_endpoint = this.gconfig.get("cli.endpoint");
    const cli_handshake_endpoint = `${cli_endpoint}/handshake`;

    const url = new Url(cli_handshake_endpoint);
    if(
      (
        // the browser is Safari and the protocol is HTTP
        isSafari() && url.protocol == "http"
      )
        ||
      (
        // the protocol is HTTP and the target is not localhost
        url.protocol == "http" && !["127.0.0.1", "localhost"].includes(url.host)
      )
    ) {
      this.proxy.mode = "popup";
      this.proxy.setProxy(cli_endpoint);
      this.logger.debug(`TransparentProxy mode set to 'popup' (target is "${cli_endpoint}")`);
    } else {
      this.proxy.mode = "direct";
      this.logger.debug("TransparentProxy mode set to 'direct'");
    }

    this.current_host = `${url.host}${url.port ? ":" + url.port : ""}`;

    clearTimeout(this.timeout_connect);
    if(this.state == CliConnectorStates.connected) {
      this.logger.debug("Refusing attempt to connect to the CLI, already in 'connected' state.");
      return;
    }

    this.logger.info(`Trying to connect to ${cli_handshake_endpoint} for CLI integration...`);

    this._setConnectivityState(CliConnectorStates.connecting);

    this.proxy.post(cli_handshake_endpoint, {
      builder_version: process.env.VERSION,
      timeout: timeout_ms,
    }).then(response => {
      this.cli_version = response.data.version;
      this.logger.success(`Got a handshake from CLI ${this.cli_version}`);

      // We have connectivity! Open WS.
      this.connectToWS();
    }).catch(_error => {
      this.logger.warn("No reply. CLI is probably not running in server mode.");
      this.logger.info("You can download the CLI from https://github.com/Develatio/nebulant-cli");
      this.logger.info("Once downloaded, please run it in 'server mode' using the '-s' argument: ./nebulant serve");
      this.logger.info(`Retrying to connect in ${retry_ms} ms...`);
      clearTimeout(this.timeout_connect);
      this.timeout_connect = setTimeout(() => this.connect(), retry_ms);

      this.connection_attempts += 1;
      if(this.connection_attempts > 3 && this.gconfig.get("ui.showDownloadCli_2")) {
        this.eventBus.publish("OpenDownloadCli");
      }
    });
  }

  connectToWS() {
    const cli_ws_endpoint = `${this.gconfig.get("cli.ws_endpoint")}/${this.execution_uuid}`;
    this.logger.info(`Trying to connect to ${cli_ws_endpoint}...`);
    this.proxy.WebSocket(cli_ws_endpoint);
  }

  onWebSocketOpen(_evt) {
    const cli_ws_endpoint = `${this.gconfig.get("cli.ws_endpoint")}/${this.execution_uuid}`;
    this.logger.success(`Connected to CLI at ${cli_ws_endpoint}!`);
    this._setConnectivityState(CliConnectorStates.connected);
  }

  onWebSocketClose(_evt) {
    this.logger.warn("Disconnected from CLI!");
    this.proxy.closeWS();

    // Maybe try to reconnect?
    if(this.state != CliConnectorStates.disconnected) {
      const retry_ms = this.gconfig.get("cli.retry_ms");

      this._setConnectivityState(CliConnectorStates.connecting);
      clearTimeout(this.timeout_connect);
      this.timeout_connect = setTimeout(() => {
        this.connect();
      }, retry_ms);
    }
  }

  onWebSocketError(_err) {
    this.logger.warn("Disconnected from CLI!");
    this.proxy.closeWS();

    // Maybe try to reconnect?
    if(this.state != CliConnectorStates.disconnected) {
      const retry_ms = this.gconfig.get("cli.retry_ms");

      this._setConnectivityState(CliConnectorStates.connecting);
      clearTimeout(this.timeout_connect);
      this.timeout_connect = setTimeout(() => {
        this.connect();
      }, retry_ms);
    }
  }

  onWebSocketMessage(evt) {
    let data;
    try {
      data = JSON.parse(evt.data);
      this.handleWSevent(data);
    } catch (error) {
      this.logger.error("Error while parsing WS message from CLI");
      this.logger.error(error);
      this.logger.debug(evt);
    }
  }

  disconnect() {
    this._setConnectivityState(CliConnectorStates.disconnected);
    clearTimeout(this.timeout_connect);

    this.proxy.closeWS();
    this.proxy.closeProxy();
    this.current_host = "";
  }

  handleWSevent(data) {
    let state;
    const dql = new DiagramQL();

    this.logger.debug(`Received data from CLI:`);
    this.logger.debug(`CLI chunk\ttype_id: ${data.type_id}`);

    switch (data.type_id) {
      case 0: // This is a log message
        // Stop right here if there is no actual message or if the message is an
        // empty string.
        if(!data.message) break;

        const logfn = this.logger.getLoggerForLevel(data.log_level);
        // The field "raw" let's us know if the message we're receiving is a
        // message from the CLI itself or if it's a chunk of data from the
        // stdout / stderr of a command.
        //
        // If it's a "raw" message, we should tell the logger that it should
        // check if it should append the message to a previous log line that was
        // already rendered.
        if(data.raw) {
          this.logger.setRawMode(data.thread_id);
        }

        logfn(data.message);

        if(data.raw) {
          this.logger.unsetRawMode();
        }
        break;

      case 1: // This is a control state event (CLI is reporting it's current execution state)
        this.logger.debug(`CLI chunk\tevent_id: ${data.event_id}`);
        state = CLI_STATE_2_CONNECTIVITY_STATE[data.event_id];
        this._setConnectivityState(state);

        if(state <= CliConnectorStates.connected) {
          this.logger.clearRawModePointers();
        }

        if(data.event_id == CliEventStates.STARTED_PROCESSING_BP) {
          const engine = this.runtime.get("objects.engine");
          engine.unMarkAllAsFaulty();
        } else if(data.event_id == CliEventStates.UNHANDLED_ACTION_ERROR && data?.extra?.action_id) {
          const engine = this.runtime.get("objects.engine");

          const node = engine.model.getCell(data.extra.action_id);
          engine.markOneAsFaulty(node);
        }
        break;

      case 2: // This is a status event (CLI is reporting it's current status, eg, execution state + actions in progress)
        this.logger.debug(`CLI chunk\tlast_known_event_id: ${data.last_known_event_id}`);
        const engine = this.runtime.get("objects.engine");
        state = CLI_STATE_2_CONNECTIVITY_STATE[data.last_known_event_id];
        this._setConnectivityState(state);

        // Process the currently being executed uuids
        if(!Array.isArray(data.extra.uuids_in_progress)) {
          data.extra.uuids_in_progress = [];
        }

        // First, find the nodes that are currently set to "running"
        const runningNodes = dql.query(`nodes | find: {
          "attributes.running": {
            "$eq": true
          }
        }`) || [];
        const runningNodesIDs = runningNodes.map(node => node.id);

        // runningNodesIDs contains an array of the nodes that are currently highlighted.
        // data.extra.uuids_in_progress contains an array of the nodes that should be highlighted.
        //
        // We need to leave the UI in the same state the CLI dictates us, so we must do:
        //
        // * an intersection - to find out which nodes should be skipped (as they are already highlighted)
        // * a left difference - to find out which nodes should be unhighlighted (as they should now appear as stopped)
        // * a right difference - to find out which nodes should be highlighted (as they should now appear as running)

        //const intersection = runningNodesIDs.filter(id => data?.extra?.uuids_in_progress.includes(id));
        const left_difference = runningNodesIDs.filter(id => !data?.extra?.uuids_in_progress.includes(id));
        const right_difference = data?.extra?.uuids_in_progress.filter(id => !runningNodesIDs.includes(id));

        if(left_difference.length) {
          dql.query(`nodes | find: {
            "id": {
              "$in": ${dql.escape(left_difference)}
            }
          }`)?.forEach(node => {
            node.prop("running", false, { skip_undo_stack: true });
            engine.unHighlightOne(node, {
              caller: "cli",
            });
          });
        }

        if(right_difference.length) {
          dql.query(`nodes | find: {
            "id": {
              "$in": ${dql.escape(right_difference)}
            }
          }`)?.forEach(node => {
            node.prop("running", true, { skip_undo_stack: true });
            engine.highlightOne(node, {
              persistent: true,
              caller: "cli",
            });
          });
        }

        if(state <= CliConnectorStates.connected) {
          this.logger.clearRawModePointers();
        }

        // TODO: Should we lock the paper while "running"?
        // engine.setInteractivity(false);

        // TODO: Should we try to center?
        //this.eventBus.publish("CenterOnNodes", { node_ids: data.extra.uuids_in_progress });
        break;

      default:
        break;
    }
  }

  run({ blueprint }) {
    // Note: the last fragment of the URL (the execution_uuid) is in fact the client_uuid. The difference
    // between "execution_uuid" and "client_uuid" is that the "execution_uuid" identifies the execution
    // itself, while the "client_uuid" identifies the Websocket client to which the execution log should
    // be sent.
    //
    // This separation exists because the CLI might be used to provide service to multiple users at the
    // same time, but this is an edge case we haven't reached yet. As of now, the execution_uuid and the
    // client_uuid will remain the same, thus we're passing the execution_uuid instead of the client_uuid.
    const cli_run_endpoint = `${this.gconfig.get("cli.endpoint")}/blueprint/${this.execution_uuid}`;

    if(semverGt(blueprint.min_cli_version, this.cli_version)) {
      let msg = `Minimum required CLI version in order to run this blueprint is v${blueprint.min_cli_version}.\n`;
      msg += `You're currently connected to a CLI with version v${this.cli_version}`;

      this.logger.error(msg);

      return new Promise((_resolve, reject) => {
        reject(msg);
      });
    }

    return new Promise((resolve, reject) => {
      this.logger.info("Sending blueprint to CLI...");

      this.proxy.post(cli_run_endpoint, {
        blueprint,
        execution_uuid: this.execution_uuid,
      }).then(response => {
        this.logger.success("CLI received the blueprint");
        resolve(response.data);
      }).catch(err => {
        if(err.response) {
          // The request was made and the CLI responded with a status code
          // that falls out of the range of 2xx
          this.logger.error("CLI rejected the blueprint.");

          const { data } = err;

          try {
            if(data?.Fail == true) {
              data?.Errors.forEach(error => {
                this.logger.error(`${error}`);
              });
            }
          } catch (_err) {
            // noop
          }
        } else {
          this.logger.error("CLI didn't reply");
        }

        reject("There was an error while running the blueprint. Check log for details.");
      });
    });
  }

  sendCommand(command) {
    const command_endpoint = `${this.gconfig.get("cli.endpoint")}/${command}/${this.execution_uuid}`

    if(this.state < CliConnectorStates.connected) {
      return new Promise((_resolve, reject) => {
        this.logger.debug("Refusing to send commands to CLI as CLI is not connected.");
        reject();
      });
    }

    return new Promise((resolve, reject) => {
      this.logger.info(`Sending ${command} command to CLI...`);

      this.proxy.post(command_endpoint).then(response => {
        this.logger.success(`CLI received the ${command} command`);
        resolve(response.data);
      }).catch(error => {
        if(error.response) {
          this.logger.error(`CLI rejected the ${command} command`);

          try {
            const { data } = error.response;

            if(data.Fail == true) {
              data.Errors.forEach(error => {
                this.logger.error(`${error}`);
              });
            }
          } catch (_err) {
            // noop
          }
        } else {
          this.logger.error("CLI didn't reply to command request");
        }
        reject();
      });
    });
  }

  autocomplete({ id, blueprint }) {
    const timeout_ms = this.gconfig.get("cli.timeout_ms");
    const cli_autocomplete_endpoint = `${this.gconfig.get("cli.endpoint")}/autocomplete/`;

    if(this.state < CliConnectorStates.connected) {
      return new Promise((_resolve, reject) => {
        this.logger.debug("Refusing to send autocomplete blueprint to CLI as CLI is not connected.");
        reject();
      });
    }

    return new Promise((resolve, reject) => {
      this.logger.info("Sending autocomplete blueprint to CLI...");

      this.proxy.post(cli_autocomplete_endpoint, {
        blueprint,
      }, {
        ...id && ({ __request_id: id }),
        timeout: timeout_ms,
      }).then(response => {
        this.logger.success("CLI received the autocomplete blueprint");

        // Hacer un mini-refactor en la estructura de datos
        // devuelta por el CLI para facilitar el acceso a los
        // resultados individuales.
        const data = {};
        Object.entries(response.data.result).forEach(([k, v]) => {
          data[k] = v[0].value;
        });

        resolve(data);
      }).catch(err => {
        if(err.response) {
          this.logger.error("CLI failed runnning the autocomplete request");

          const { data, status } = err;

          if(data?.Fail) {
            data?.Errors.forEach(error => {
              this.logger.error(`${error}`);
            });
          }

          if(status == 401) {
            this.eventBus.publish("Toast", {
              msg: `
                Autocomplete request failed because of a problem with the provided credencials.
                Please check log for details.
              `,
              lvl: "error",
            });
          }

        } else {
          if(err.error.name == "AbortError") {
            this.logger.info("Autocomplete request was either superseded by another request or timeout was reached");
          } else {
            this.logger.error("CLI didn't reply to autocomplete request");
          }
        }

        reject();
      });
    });
  }

  asset({ asset_id, keyword, limit, offset, sort, region }) {
    const timeout_ms = this.gconfig.get("cli.timeout_ms");
    const params = new URLSearchParams({
      search: keyword,
      limit,
      offset,
      sort,
      ...(region ? { region } : {}),
    }).toString();
    const asset_endpoint = `${this.gconfig.get("cli.endpoint")}/assets/${asset_id}?${params}`;

    if(this.state < CliConnectorStates.connected) {
      return new Promise((_resolve, reject) => {
        this.logger.debug("Refusing to send autocomplete blueprint to CLI as CLI is not connected.");
        reject();
      });
    }

    return new Promise((resolve, reject) => {

      this.logger.info(`Sending ${asset_id} asset request to CLI...`);

      this.proxy.get(asset_endpoint, {
        __request_id: `asset_${asset_id}`,
        timeout: timeout_ms,
      }).then(response => {
        this.logger.success("CLI received the asset data");
        resolve(response.data);
      }).catch(err => {
        if(err.response) {
          this.logger.error(`CLI returned a bad reply to asset request: ${err.data || ""}`);
        } else {
          if(err.error.name == "AbortError") {
            this.logger.info(`Request for asset ${asset_id} was superseded by another request`);
          } else {
            this.logger.error("CLI didn't reply to asset request");
          }
        }
        reject();
      });
    });
  }
}
