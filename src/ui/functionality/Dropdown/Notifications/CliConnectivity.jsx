import { useState, useEffect } from "react";

import { Runtime } from "@src/core/Runtime";
import { EventBus } from "@src/core/EventBus";
import { CliConnectorStates } from "@src/core/CliConnector";
import { CliConnectivityStatus } from "@src/ui/structure/CLIConnectivityStatus";

export const CliConnectivity = () => {
  const runtime = new Runtime();
  const eventBus = new EventBus();
  const cliConnector = runtime.get("objects.cliConnector");

  const [cliState, setCliState] = useState(cliConnector.state);

  useEffect(() => {
    const _setCliState = (_msg, data) => setCliState(data.state);

    eventBus.subscribe("ConnectivityStateChanged", _setCliState);

    return () => {
      eventBus.unsubscribe("ConnectivityStateChanged", _setCliState);
    };
  }, []);

  if(cliState === CliConnectorStates.connected) {
    return "";
  }

  return (
    <div className="d-flex w-100 cliconnectivity align-items-center">
      <CliConnectivityStatus />
      <small className="ms-2 text-truncate user-select-none text-muted">
        Connect to the CLI and fetch real-time data
      </small>
    </div>
  );
}
