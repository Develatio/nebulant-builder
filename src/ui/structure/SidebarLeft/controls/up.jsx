import { useEffect, useState } from "react";

import { Runtime } from "@src/core/Runtime";
import { EventBus } from "@src/core/EventBus";

import { CliConnectorStates } from "@src/core/CliConnector";
import { generateBlueprint } from "@src/components/blueprintGenerators/generateBlueprint";

import { Icon } from "@src/ui/functionality/Icon";
import { Tooltip } from "@src/ui/functionality/Tooltip";

import RunIcon from "@src/assets/img/icons/control/run.svg?transform";
import StopIcon from "@src/assets/img/icons/control/stop.svg?transform";
import PauseIcon from "@src/assets/img/icons/control/pause.svg?transform";
import ResumeIcon from "@src/assets/img/icons/control/resume.svg?transform";

export const Up = () => {
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
    <div className="actions up d-flex flex-row cli-integration">
      {
        connectivityState == CliConnectorStates.disconnected && (
          <div className="p-1 me-1 run disabled">
            <Tooltip
              placement="right"
              label={<>You must connect with the CLI in order to be able to execute this blueprint</>}
            >
              <Icon>
                <RunIcon />
              </Icon>
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
            className="p-1 me-1 run enabled"
            onClick={() => send()}
          >
            <Tooltip
              placement="right"
              label={<>Send the current blueprint to the CLI and execute it</>}
            >
              <Icon>
                <RunIcon />
              </Icon>
            </Tooltip>
          </div>
        )
      }

      {
        /* Busy indicator */
        (
          sendingState ||
          connectivityState == CliConnectorStates.pausing ||
          connectivityState == CliConnectorStates.stopping ||
          connectivityState == CliConnectorStates.waiting_for_cli_state
        ) ? (
          <div className="p-1 me-1 spinner d-flex bg-info">
            <div className="indicator"></div>
            <div className="px-2 text text-nowrap">
              {
                sendingState ? (
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
          <div className="p-2 me-1 pause bg-warning" onClick={() => {
            setSendingState(true);
            cliConnector.sendCommand("pause").finally(() => {
              setSendingState(false);
            });
          }}>
            <Tooltip
              placement="right"
              label={<>Pause the current execution</>}
            >
              <Icon>
                <PauseIcon />
              </Icon>
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
          <div className="p-1 me-1 resume bg-success" onClick={() => {
            setSendingState(true);
            cliConnector.sendCommand("resume").finally(() => {
              setSendingState(false);
            });
          }}>
            <Tooltip
              placement="right"
              label={<>Resume the execution</>}
            >
              <Icon>
                <ResumeIcon />
              </Icon>
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
          <div className="p-2 me-1 stop bg-danger" onClick={() => {
            setSendingState(true);
            cliConnector.sendCommand("stop").finally(() => {
              setSendingState(false);
            });
          }}>
            <Tooltip
              placement="right"
              label={<>Stop the current execution</>}
            >
              <Icon>
                <StopIcon />
              </Icon>
            </Tooltip>
          </div>
        ) : ""
      }
    </div>
  );
}
