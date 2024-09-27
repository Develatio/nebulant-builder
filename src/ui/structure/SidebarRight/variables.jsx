import { useEffect, useState } from "react";
import Badge from "react-bootstrap/esm/Badge";
//import Button from "react-bootstrap/esm/Button";
//import InputGroup from "react-bootstrap/esm/InputGroup";
import FormControl from "react-bootstrap/esm/FormControl";

import { GConfig } from "@src/core/GConfig";
import { Runtime } from "@src/core/Runtime";
import { EventBus } from "@src/core/EventBus";
import { DiagramQL } from "@src/data/DiagramQL";

import { Icon } from "@src/ui/functionality/Icon";
//import { Tooltip } from "@src/ui/functionality/Tooltip";

import AsyncIcon from "@src/assets/img/icons/ui/async.svg?transform";
//import DebugIcon from "@src/assets/img/icons/control/debug.svg?transform";
//import WrenchIcon from "@src/assets/img/icons/control/wrench.svg?transform";
import SearchIcon from "@src/assets/img/icons/control/search.svg?transform";
//import LocalizeIcon from "@src/assets/img/icons/control/localize.svg?transform";
//import DependantIcon from "@src/assets/img/icons/control/dependant.svg?transform";

const Actions = ({ variable }) => {
  const gconfig = new GConfig();
  const runtime = new Runtime();
  const eventBus = new EventBus();
  const logger = runtime.get("objects.logger");

  const engine = runtime.get("objects.engine");
  const model = runtime.get("objects.main_model");

  const dql = new DiagramQL(model);

  const showData = (node_id) => {
    const { data } = model.getCell(node_id).attributes;
    logger.debug(`Printing internal data of node id: ${node_id}`);
    logger.debug(JSON.stringify(data, true, 2));
   }

  const showDependantNodes = (node_id, variable_value) => {
    let node_ids = dql.query(
      dql.nodesUsing({
        parent: node_id,
        varname: variable_value,
      })
    )?.map(obj => obj.__node_id) || [];

    node_ids = [...new Set(node_ids)];
    if(node_ids.length == 0) return;

    // Remove duplicates and then center the paper
    eventBus.publish("CenterOnNodes", { node_ids });
  }

  return (
    <div className="d-flex actions">
      {
        gconfig.get("advanced.debug") && (
          <div className="pointer" onClick={(e) => {
            e.preventDefault();
            showData(variable.__node_id);
          }}>
            <Tooltip
              placement="left"
              label={<>Print the CLI-compatible JSON of this action</>}
            >
              <Icon className="debug">
                <DebugIcon />
              </Icon>
            </Tooltip>
          </div>
        )
      }

      <div className="pointer ms-1" onClick={(e) => {
        e.preventDefault();
        engine.centerOnNode(variable.__node_id);
      }}>
        <Tooltip
          placement="left"
          label={<>Center the canvas on the node that created this variable</>}
        >
          <Icon className="localize">
            <LocalizeIcon />
          </Icon>
        </Tooltip>
      </div>

      <div className="pointer ms-1" onClick={(e) => {
        e.preventDefault();
        showDependantNodes(variable.__node_id, variable.value);
      }}>
        <Tooltip
          placement="left"
          label={<>Show all nodes that depend on this variable</>}
        >
          <Icon className="dependant">
            <DependantIcon />
          </Icon>
        </Tooltip>
      </div>

      <div className="pointer ms-1" onClick={(e) => {
        e.preventDefault();
        runtime.get("objects.blueprintAction").openNodeSettings(variable.__node_id);
      }}>
        <Tooltip
          placement="left"
          label={<>Open the settings of this variable's node</>}
        >
          <Icon className="wrench">
            <WrenchIcon />
          </Icon>
        </Tooltip>
      </div>
    </div>
  );
}

export const Variables = () => {
  const gconfig = new GConfig();
  const runtime = new Runtime();
  const eventBus = new EventBus();

  const model = runtime.get("objects.main_model");
  const engine = runtime.get("objects.engine");

  const dql = new DiagramQL(model);

  const [selectedVars, setSelectedVars] = useState([]);
  const [varsFilter, setVarsFilter] = useState("");

  const [_, setDummy] = useState(0);

  useEffect(() => {
    const _update = () => setDummy(d => d + 1);

    eventBus.subscribe("BlueprintChange", _update);
    gconfig.notifyOnChanges("advanced.debug", _update);

    // Subscribe to selection changes so we can mask relevant output vars
    engine.selection.collection.on({
      "reset": (collection) => {
        const _selectedVars = collection.models.map(model => {
          return Object.keys(model.prop("data")?.settings?.outputs || {}).map(
            output => getIdFromOutputName(model.id, output)
          ).reduce((acc, val) => acc.concat(val), []);
        }).reduce((acc, val) => acc.concat(val), []);

        setSelectedVars(_selectedVars);

        if(_selectedVars.length) {
          // Yeah... I know... this is ugly as fuck. But it's also optimal as
          // fuck. There is no universe in which I'd change this for useRef()
          // and a clusterfuck of passing refs to each div and then looking for
          // the "correct" ref...
          const varId = _selectedVars[0];
          const element = document.getElementById(`sidebar_vars__${varId}`);

          if(!element) return;

          const parent = element.parentNode;
          parent.scrollTop = element.offsetTop - parent.offsetTop;
        }
      }
    });

    return () => {
      eventBus.unsubscribe("BlueprintChange", _update);
      gconfig.stopNotifying("advanced.debug", _update);
    }
  }, []);

  const getIdFromOutputName = (node_id, variable_name) => `${node_id}-${variable_name}`;

  const getOutputVars = (varsFilter) => {
    let qs = "nodes | outputVars";

    if(varsFilter) {
      qs += `
        | find: {
          "value": {
            "$containsi": ${dql.escape(varsFilter)}
          }
        }
      `;
    }

    return dql.query(qs) || [];
  }

  const outputVars = getOutputVars(varsFilter).map((variable, i) => {
    const varId = getIdFromOutputName(variable.__node_id, variable.__output_name);

    variable.__tmp_index = i;
    variable.__var_id = varId;
    variable.__active = selectedVars.includes(varId);

    return variable;
  });

  const cls_animated = gconfig.get("ui.highlight_animations") ? "animated" : "";

  return (
    <div className={"variables nodes flex-column h-100 d-flex"}>

      <div className="header w-100 text-start">
        Defined blueprint variables
      </div>

      <div className="d-flex align-items-center border rounded search-wrapper">
        <SearchIcon className="search" />

        <FormControl
          className="border-0 p-0"
          placeholder="Search variables..."
          onChange={(e) => setVarsFilter(e.target.value)}
          value={varsFilter}
        />
      </div>

      <div className="content">
        {outputVars.map(variable => (
          <div
            className={`
              wrapper
              ${variable.type.split(":")[0]}
              ${variable.__active ? "active" : ""}
            `}
            key={variable.__tmp_index}
            id={`sidebar_vars__${variable.__var_id}`}
          >
            <svg className="border">
              <rect rx="6" ry="6" className={`${cls_animated}`}></rect>
            </svg>

            <div
              className="widget d-flex flex-column"
              onClick={() => {
                eventBus.publish("CenterOnNode", {
                  node_id: variable.__node_id,
                });
              }}
            >
              <div className="d-flex align-items-start flex-column">
                {
                  variable.async ? (
                    <Icon
                      className="async me-2"
                      title="This variable is async. It's content won't be available immediately."
                    >
                      <AsyncIcon />
                    </Icon>
                  ) : ""
                }

                <div className="varname" title={variable.value}>
                  {variable.value}
                </div>

                {
                  /*
                  <div className="varinfo" title={variable.label}>
                    {variable.__label} v{variable.__version}
                  </div>
                  */
                }
              </div>

              <div className="d-flex flex-wrap flex-gap-1">
                <div className="d-flex">
                  <Badge className={`${variable.type.split(":")[0]} fill variable_badge rounded-end-0 user-select-none`}>
                    {variable.type.split(":")[0]}
                  </Badge>
                  <Badge className={`${variable.type.split(":")[0]} border variable_badge rounded-start-0 user-select-none`}>
                    {variable.type.split(":")[1]}
                  </Badge>
                </div>

                {
                  variable.capabilities?.map?.((capability, idx) => (
                    <Badge key={idx} bg="success" className={`${variable.type.split(":")[0]} border capability_badge`}>{capability}</Badge>
                  ))
                }
              </div>

            </div>

            {/* <Actions /> */}
          </div>
        ))}
      </div>
    </div>
  );
}
