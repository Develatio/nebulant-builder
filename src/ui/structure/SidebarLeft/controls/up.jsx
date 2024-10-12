import { useState, useEffect } from "react";

import { Runtime } from "@src/core/Runtime";
import { EventBus } from "@src/core/EventBus";

import { Tooltip } from "@src/ui/functionality/Tooltip";

import InfoIcon from "@src/assets/img/icons/control/info.svg?transform";
import BreadcrumbSeparatorIcon from "@src/assets/img/icons/control/breadcrumb-separator.svg?transform";

export const Up = () => {
  const runtime = new Runtime();
  const eventBus = new EventBus();

  const engine = runtime.get("objects.engine");

  const [breadcrumbs, setBreadcrumbs] = useState([]);

  const updateBreadcrumbs = () => {
    const model = runtime.get("objects.main_model");
    const startNode = model.getStartNode();
    if(!startNode) return;
    const { name } = startNode.prop("data/settings/parameters");
    const breadcrumbs = [{
      label: name,
      level: 0,
    }];

    if(engine.hasEngineLayers()) {
      engine.getEngineLayers().map((layer, idx) => {
        const { group_id } = layer;
        const group = model.getCell(group_id);
        const startNode = group.getStartNode();
        const { parameters } = startNode.prop("data/settings");

        breadcrumbs.push({
          label: parameters.name,
          level: idx + 1,
        })
      });
    }

    setBreadcrumbs(breadcrumbs);
  }

  useEffect(() => {
    eventBus.subscribe("BlueprintLoaded", updateBreadcrumbs);
    eventBus.subscribe("BlueprintChange", updateBreadcrumbs);
    runtime.notifyOnChanges("state.canvasLayers", updateBreadcrumbs);

    return () => {
      eventBus.subscribe("BlueprintLoaded", updateBreadcrumbs);
      eventBus.subscribe("BlueprintChange", updateBreadcrumbs);
      runtime.stopNotifying("state.canvasLayers", updateBreadcrumbs);
    };
  }, []);

  return (
    <div className="actions up d-flex flex-row gap-2">
      <div className="infoControl">
        <div className="info" onClick={() => eventBus.publish("ToggleInfo")}>
          <Tooltip
            placement="right"
            label={<>Toggle comments (<kbd>ctrl + i</kbd>)</>}
          >
            <div>
              <InfoIcon />
            </div>
          </Tooltip>
        </div>
      </div>

      <div className="breadcrumbs d-flex gap-1">
        {
          breadcrumbs.map((piece, idx, arr) => {
            return (
              <div className="d-flex gap-1" key={`${piece.label}-${piece.level}`}>
                <span
                  className={`
                    breadcrumb
                    user-select-none
                    ${idx == arr.length - 1 ? "text-muted" : "pointer actionable"}
                  `}
                  onClick={() => engine.setEngineLayersLevel(piece.level)}
                >
                  {piece.label}
                </span>
                {
                  idx < arr.length - 1 ? (
                    <span className="user-select-none text-muted sep">
                      <BreadcrumbSeparatorIcon />
                    </span>
                  ) : ""
                }
              </div>
            )
          })
        }
      </div>
    </div>
  );
}
