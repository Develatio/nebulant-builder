import { useState, useEffect } from "react";

import { Runtime } from "@src/core/Runtime";
import { EventBus } from "@src/core/EventBus";
import { CliConnectorStates } from "@src/core/CliConnector";

const CLI_STATE_MAP = {
  [CliConnectorStates.disconnected]: {
    class: "status-danger",
    fn: "connect",
    text: "Disconnected from CLI",
  },
  [CliConnectorStates.connecting]: {
    class: "status-warning",
    fn: "disconnect",
    text: "Connecting to CLI",
  },
  [CliConnectorStates.connected]: {
    class: "status-success",
    fn: "disconnect",
    text: "Connected to CLI",
  },
};

// All these states are subtypes of the "connected" state
CLI_STATE_MAP[CliConnectorStates.running] = CLI_STATE_MAP[CliConnectorStates.connected];
CLI_STATE_MAP[CliConnectorStates.paused] = CLI_STATE_MAP[CliConnectorStates.connected];
CLI_STATE_MAP[CliConnectorStates.pausing] = CLI_STATE_MAP[CliConnectorStates.connected];
CLI_STATE_MAP[CliConnectorStates.stopping] = CLI_STATE_MAP[CliConnectorStates.connected];
CLI_STATE_MAP[CliConnectorStates.waiting_for_cli_state] = CLI_STATE_MAP[CliConnectorStates.connected];

export const CliConnectivityStatus = () => {
  const runtime = new Runtime();
  const eventBus = new EventBus();
  const cliConnector = runtime.get("objects.cliConnector");

  const [cliState, setCliState] = useState(cliConnector.state);

  const icm = CLI_STATE_MAP[cliState];

  useEffect(() => {
    const _setCliState = (_msg, data) => setCliState(data.state);

    eventBus.subscribe("ConnectivityStateChanged", _setCliState);

    return () => {
      eventBus.unsubscribe("ConnectivityStateChanged", _setCliState);
    };
  }, []);

  return (
    <div
      className={`cli-connectivity-status d-flex align-items-center ${icm.class} pointer`}
      onClick={() => cliConnector[icm.fn]()}
    >
      <span className="text-white fw-bold text-nowrap">
        {icm.text}{cliConnector.current_host ? ` at ${cliConnector.current_host}` : ""}
      </span>
    </div>
  );
}
