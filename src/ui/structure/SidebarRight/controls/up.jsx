import { useState } from "react";

import { Runtime } from "@src/core/Runtime";
import { GConfig } from "@src/core/GConfig";

import { alphaDecToHex } from "@src/utils/colors";
import { Tooltip } from "@src/ui/functionality/Tooltip";

export const Up = () => {
  const runtime = new Runtime();
  const gconfig = new GConfig();

  const engine = runtime.get("objects.engine");
  const model = runtime.get("objects.main_model");

  const [minimap, _] = useState(gconfig.get("ui.minimap"));

  return (
    <div className={`minimap-wrapper ${minimap ? "enabled" : "disabled"}`}>
      <div className="minimap-container">
        {
          !minimap && engine.hasEngineLayers() ? (
            <Tooltip
              placement="left"
              label={<>Current layer</>}
            >
              <div className="minimap-placeholder"></div>
            </Tooltip>
          ) : ""
        }
      </div>

      <div className="stack">
        {
          // canvasLayers is an array representing the path in which a set of
          // groups were expanded. If canvasLayers is empty it means that the
          // user is looking at the main canvas.
        }
        {
          // Draw one minimap-card per group, excluding the latest one since
          // the minimap is already rendering it.
          engine.hasEngineLayers() && (
            engine.getEngineLayers().slice(0, -1).map((layer, idx) => {
              const { group_id } = layer;
              const group = model.getCell(group_id);
              const startNode = group.getStartNode();
              const { parameters } = startNode.prop("data/settings");
              return (
                <Tooltip
                  key={idx}
                  placement="left"
                  label={<>{parameters.name}</>}
                >
                  <div
                    className="minimap-card"
                    style={{
                      borderColor: parameters.color,
                      boxShadow: `0px 0px 6px 0px ${parameters.color}${alphaDecToHex(100)}`,
                      backgroundColor: `${parameters.color}${alphaDecToHex(10)}`,
                    }}
                    onClick={() => engine.resetEngineLayers(engine.getEngineLayers().slice(0, -1).length - idx)}
                  ></div>
                </Tooltip>
              )
            })
          )
        }
        {
          // This will allow the user to return to the main canvas.
          engine.hasEngineLayers() && (
            <Tooltip
              placement="left"
              label={<>Return to main view</>}
            >
              <div
                className="minimap-card"
                style={{
                  borderColor: "#ccc",
                  boxShadow: "0px 0px 6px 0px rgba(0, 0, 0, 0.5)",
                  backgroundColor: `#000000${alphaDecToHex(5)}`,
                }}
                onClick={() => engine.resetEngineLayers()}
              ></div>
            </Tooltip>
          )
        }
      </div>
    </div>
  );
}
