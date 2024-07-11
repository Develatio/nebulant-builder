import { useState, useEffect } from "react";

import Navbar from "react-bootstrap/esm/Navbar";

import { Runtime } from "@src/core/Runtime";
import { EventBus } from "@src/core/EventBus";
import { Tooltip } from "@src/ui/functionality/Tooltip";
import { CliConnectivityStatus } from "@src/ui/structure/CLIConnectivityStatus";

import ErrorIcon from "@src/assets/img/icons/ui/error.svg?transform";
import WarningIcon from "@src/assets/img/icons/ui/warning.svg?transform";

const focusFirstNode = (type) => {
  const runtime = new Runtime();
  const model = runtime.get("objects.main_model");

  const start = model.getStartNode();
  model.bfs(start, (node, _distance) => {
    const state = node.prop("state");
    if(Object.keys(state[type]).length > 0) {
      const eventBus = new EventBus();
      eventBus.publish("CenterOnNode", { node_id: node.id });
      return false;
    }
  }, {
    outbound: true,
  });
}

const focusFirstWarnNode = () => focusFirstNode("warnings");
const focusFirstErrNode = () => focusFirstNode("errors");

export const StatusBar = () => {
  const runtime = new Runtime();
  const eventBus = new EventBus();

  const [blueprintName, setBlueprintName] = useState("");
  const [blueprintVersion, setBlueprintVersion] = useState("");

  const updateBlueprintName = () => {
    const model = runtime.get("objects.main_model");
    const { name, version } = model.getStartNode().prop("data/settings/parameters");
    setBlueprintName(name);
    setBlueprintVersion(version);
  }

  const [warnCounter, setWarnCounter] = useState(0);
  const [errCounter, setErrCounter] = useState(0);
  const [unsavedChanges, setUnsavedChanges] = useState(0);

  useEffect(() => {
    eventBus.subscribe("BlueprintLoaded", updateBlueprintName);
    eventBus.subscribe("BlueprintChange", updateBlueprintName);
    runtime.notifyOnChanges("state.ops_counter", setUnsavedChanges);
    runtime.notifyOnChanges("state.warn_counter", setWarnCounter);
    runtime.notifyOnChanges("state.err_counter", setErrCounter);

    return () => {
      eventBus.subscribe("BlueprintLoaded", updateBlueprintName);
      eventBus.subscribe("BlueprintChange", updateBlueprintName);
      runtime.stopNotifying("state.ops_counter", setUnsavedChanges);
      runtime.stopNotifying("state.warn_counter", setWarnCounter);
      runtime.stopNotifying("state.err_counter", setErrCounter);
    };
  }, []);

  return (
    <Navbar variant="dark" data-bs-theme="dark" expand="sm" className="w-100 px-3 statusbar">
      <CliConnectivityStatus />

      <div className="menu-sep"></div>

      <div className="d-flex justify-content-left ncounters">
        <div className="d-flex align-items-center pointer ncounter" onClick={focusFirstWarnNode}>
          <WarningIcon className="warning" />
          <span className="text-warning">{warnCounter}</span>
        </div>

        <div className="d-flex align-items-center pointer ncounter" onClick={focusFirstErrNode}>
          <ErrorIcon className="error" />
          <span className="text-danger">{errCounter}</span>
        </div>
      </div>

      <div className="menu-sep"></div>

      <div className="title-wrapper flex-grow-1">
        <div className="d-flex flex-row align-items-center" onClick={() => {
          const runtime = new Runtime();
          const model = runtime.get("objects.main_model");

          const start = model.getStartNode();
          runtime.get("objects.blueprintAction").openNodeSettings(start.id);
        }}>
          <Tooltip placement="top" label={blueprintName}>
            <span className="d-block pe-1 py-0 mb-0 text-center text-truncate pointer">
              { blueprintName }
            </span>
          </Tooltip>
          {
            blueprintVersion && blueprintVersion !== "draft" ? (
              <span className="text-muted">(snapshot { blueprintVersion })</span>
            ) : ""
          }
        </div>
      </div>

      {
        unsavedChanges != 0 && (
          <>
            <div className="menu-sep"></div>
            <div className="d-flex justify-content-left">
              <span className="text-secondary text-nowrap">
                Unsaved changes
              </span>
            </div>
          </>
        )
      }
    </Navbar>
  );
}
