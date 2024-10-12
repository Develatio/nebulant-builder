import { useEffect, useState } from "react";

import { Runtime } from "@src/core/Runtime";
import { EventBus } from "@src/core/EventBus";

import { CliConnectorStates } from "@src/core/CliConnector";
import { generateBlueprint } from "@src/components/blueprintGenerators/generateBlueprint";

import { Tooltip } from "@src/ui/functionality/Tooltip";

import RunIcon from "@src/assets/img/icons/control/run.svg?transform";
import StopIcon from "@src/assets/img/icons/control/stop.svg?transform";
import PauseIcon from "@src/assets/img/icons/control/pause.svg?transform";
import ResumeIcon from "@src/assets/img/icons/control/resume.svg?transform";

export const Down = () => {
  const runtime = new Runtime();
  const eventBus = new EventBus();

  const cliConnector = runtime.get("objects.cliConnector");

  const [sendingState, setSendingState] = useState(false);
  const [connectivityState, setConnectivityState] = useState(cliConnector.state);

  useEffect(() => {
    const updateConnectivityState = (_msg, data) => {
      setConnectivityState(data.state);
    }

    eventBus.subscribe("ConnectivityStateChanged", updateConnectivityState);

    return () => {
      eventBus.unsubscribe("ConnectivityStateChanged", updateConnectivityState);
    }
  }, []);

  const send = () => {
    const nErrs = runtime.get("state.err_counter");
    if(nErrs) {
      eventBus.publish("OpenDialog", {
        title: "Blueprint can't be executed",
        body: (
          <div className="h6 callout callout-danger">
            This blueprint has <span className="fw-bold">{nErrs}</span> errors
            and can't be executed. Please fix all problems before trying to
            execute it.
          </div>
        ),
      });
      return;
    }

    const model = runtime.get("objects.main_model");
    const diagram = model.getCleanModel(
      model.getStartNode(),
      "children",
    ).serialize();

    const { actions, min_cli_version, isValid } = generateBlueprint(diagram);

    if(!isValid) {
      eventBus.publish("crash");
      return;
    }

    setSendingState(true);

    cliConnector.run({
      blueprint: {
        actions,
        min_cli_version,
      },
    }).catch(msg => {
      eventBus.publish("OpenDialog", {
        title: "Runtime error",
        body: msg,
        ok: () => {},
      });
    }).finally(() => {
      setSendingState(false);
    });
  }

  return (
<div className="actions down d-flex flex-row cli-integration">
      {
        connectivityState == CliConnectorStates.disconnected && (
          <div
            className="p-2 pe-3 d-flex connect pointer"
            onClick={() => cliConnector.connect()}
          >
            <Tooltip
              placement="right"
              label={<>You must connect to the CLI in order to be able to execute this blueprint</>}
            >
              <>
                <RunIcon className="icon" /> Connect to CLI
              </>
            </Tooltip>
          </div>
        )
      }

      {
        /* Icon shown when the UI is ready to send the blueprint to the CLI */
        (
          connectivityState == CliConnectorStates.connected &&
          !sendingState
        ) && (
          <div
            className="p-2 pe-3 d-flex run pointer"
            onClick={() => send()}
          >
            <Tooltip
              placement="right"
              label={<>Send the current blueprint to the CLI and execute it</>}
            >
              <>
                <RunIcon className="icon" /> Run blueprint
              </>
            </Tooltip>
          </div>
        )
      }

      {
        /* Busy indicator */
        (
          sendingState ||
          connectivityState == CliConnectorStates.waiting ||
          connectivityState == CliConnectorStates.pausing ||
          connectivityState == CliConnectorStates.stopping ||
          connectivityState == CliConnectorStates.waiting_for_cli_state
        ) ? (
          <div className="p-2 pe-3 d-flex spinner d-flex gap-2">
            <div className="indicator"></div>
            <div className="user-select-none text-nowrap">
              {
                sendingState ? (
                  "Processing..."
                ) : connectivityState == CliConnectorStates.waiting ? (
                  "Processing..."
                ) : connectivityState == CliConnectorStates.pausing ? (
                  "Pausing..."
                ) : connectivityState == CliConnectorStates.stopping ? (
                  "Stopping..."
                ) : connectivityState == CliConnectorStates.waiting_for_cli_state ? (
                  "Retrieving CLI state..."
                ) : "Please wait..."
              }
            </div>
          </div>
        ) : ""
      }

      {
        /* Icon shown when the CLI is running something */
        (
          connectivityState == CliConnectorStates.running &&
          !sendingState
        ) ? (
          <div className="p-2 me-1 d-flex pause pointer bg-warning" onClick={() => {
            setSendingState(true);
            cliConnector.sendCommand("pause").finally(() => {
              setSendingState(false);
            });
          }}>
            <Tooltip
              placement="right"
              label={<>Pause the current execution</>}
            >
              <>
                <PauseIcon className="icon" />
              </>
            </Tooltip>
          </div>
        ) : ""
      }

      {
        /* Icon shown when the CLI was running something, but is currently paused */
        (
          connectivityState == CliConnectorStates.paused &&
          !sendingState
        ) ? (
          <div className="p-2 me-1 d-flex resume pointer bg-success" onClick={() => {
            setSendingState(true);
            cliConnector.sendCommand("resume").finally(() => {
              setSendingState(false);
            });
          }}>
            <Tooltip
              placement="right"
              label={<>Resume the execution</>}
            >
              <>
                <ResumeIcon className="icon" />
              </>
            </Tooltip>
          </div>
        ) : ""
      }

      {
        /* Icon shown when the CLI is running or paused */
        (
          (
            connectivityState == CliConnectorStates.running ||
            connectivityState == CliConnectorStates.paused
          ) &&
          !sendingState
        ) ? (
          <div className="p-2 me-1 d-flex stop pointer bg-danger" onClick={() => {
            setSendingState(true);
            cliConnector.sendCommand("stop").finally(() => {
              setSendingState(false);
            });
          }}>
            <Tooltip
              placement="right"
              label={<>Stop the current execution</>}
            >
              <>
                <StopIcon className="icon" />
              </>
            </Tooltip>
          </div>
        ) : ""
      }
    </div>
  );
}
