import { Logger } from "@src/core/Logger";
import { Runtime } from "@src/core/Runtime";
import { EventBus } from "@src/core/EventBus";
import { clone } from "@src/utils/lang/clone";
import { MIN_CLI_VERSION } from "@src/utils/constants";
import {
  Migrator as DiagramMigrator,
} from "@src/components/implementations/base/migrators/DiagramDataMigrator";

export const loadFile = async (file) => {
  return new Promise((resolve) => {
    const logger = new Logger();
    const reader = new FileReader();

    reader.onload = e => {
      try {
        const data = JSON.parse(e.target.result);
        // TODO: Validate the data structure?
        resolve(data);
      } catch (error) {
        logger.error(`Failed while trying to read the file. ${error}`);
        resolve(null);
      }
    };

    logger.debug(`Trying to read the content of ${file.name} (${file.size} bytes)...`);
    reader.readAsText(file);
  });
}

export const loadContent = async ({
  organization_slug,
  collection_slug,
  blueprint_slug,
  version,
}) => {
  const runtime = new Runtime();
  const backendConnector = runtime.get("objects.backendConnector");

  return await backendConnector.getContent({
    organization_slug,
    collection_slug,
    blueprint_slug,
    version,
  }).catch(error => {
    // If we ended up here it might be because the user provided us with a
    // blueprint_uri (so we didn't create a new blueprint), but we failed
    // to load it (maybe because of permission error?). Anyways, we ended up
    // here so we should return null.
    const eventBus = new EventBus();
    eventBus.publish("Toast", { msg: error, lvl: "error" });
    return null;
  });
}

export const createNewBlueprint = () => {
  const logger = new Logger();
  const runtime = new Runtime();

  logger.debug("Creating a new blueprint!");

  const shapes = runtime.get("objects.shapes");

  const BaseDiagramModel = runtime.get("object.BaseDiagramModel");
  const model = new BaseDiagramModel();

  const BaseEngine = runtime.get("object.BaseEngine");
  const engine = new BaseEngine({ model });

  logger.debug("\tAdding new [Start] node...");
  let start = new shapes.nebulant.rectangle.vertical.executionControl.Start();
  // Add default settings
  start.enforceSettingsStructure();
  let { width, height } = start.getBBox();
  const [x, y] = engine.getCenter();
  start.position(x - (width / 2), y - (height / 2));
  start.addTo(model);

  const cm = model.commandManager;
  cm.reset();

  const payload = {
    blueprint: {
      cm: cm.toJSON(),
      diagram: model.serialize(),
      diagram_version: new DiagramMigrator().getLatestVersion(),

      n_errors: 0,
      n_warnings: 0,

      actions: [],
      min_cli_version: MIN_CLI_VERSION,

      builder_version: process.env.VERSION,
    }
  };

  const tmppayload = clone(payload);
  tmppayload.blueprint.diagram = "<json blob>";
  logger.debug(JSON.stringify(tmppayload, null, 2));

  return payload;
}

export const importAsBlueprint = (data, opts = {}) => {
  const logger = new Logger();
  const runtime = new Runtime();
  const eventBus = new EventBus();

  logger.debug("Importing blueprint!");

  const engine = runtime.get("objects.engine");
  const model = runtime.get("objects.main_model");

  logger.debug("\tClearing the main model...");
  model.reset();

  logger.debug("\tResetting the command manager");
  const cm = runtime.get("objects.commandManager");
  cm.reset();

  logger.debug("\tSetting the state.pristineBlueprint to this blueprint...");
  runtime.set("state.pristineBlueprint", clone(data.blueprint));

  logger.debug("\tResetting layers engine...");
  engine.resetEngineLayers();

  let loadRes = false;
  if(opts.load_autosave) {
    logger.debug("\tLoading autosave blueprint into the main model...");
    loadRes = model.deserialize(data.blueprint, { load_autosave: true });
  } else {
    logger.debug("\tLoading blueprint into the main model...");
    loadRes = model.deserialize(data.blueprint);
  }

  logger.debug("\tResetting state.ops_counter...");
  runtime.set("state.ops_counter", 0);

  if(loadRes) {
    eventBus.publish("BlueprintLoaded");
    eventBus.publish("BlueprintChange");
  }
}

export const importAsGroup = (data, { clientX, clientY }) => {
  const logger = new Logger();
  const runtime = new Runtime();

  logger.debug("Importing blueprint as group!");

  const engine = runtime.get("objects.engine");
  const shapes = runtime.get("objects.shapes");
  const model = runtime.get("objects.main_model");

  let p = engine.clientToLocalPoint({ x: clientX, y: clientY });

  logger.debug(`\tGroups should be created at (${p.x}, ${p.y})`);

  // Create the actual group and add to it the "selection"
  const group = new shapes.nebulant.rectangle.group.Group();
  const { width, height, x, y } = group.getBBox();
  group.addTo(model);
  group.position(p.x - width / 2, p.y - height / 2);

  // Add the dragged blueprint to a new model
  const BaseDiagramModel = runtime.get("object.BaseDiagramModel");
  const tmpModel = new BaseDiagramModel();
  tmpModel.deserialize(data.blueprint);

  // Add the cells to the main model
  let cells = tmpModel.getCells();
  cells = tmpModel.cloneSubgraph(cells);
  cells = Object.values(cells);
  model.addCells(cells);
  group.addToGroup(cells);

  // Move the cells so that they match the position of the group
  logger.debug(`\tSetting group's [Start] node`);
  const startNode = group.getStartNode();
  startNode.prop("data/settings/parameters/first_action", false);
  startNode.prop("data/settings/parameters/group_settings_enabled", true);
  startNode.prop("data/settings/info", "");
  startNode.setInfo("");

  const { x: sx, y: sy } = startNode.getBBox();
  const offset = {
    x: sx - x,
    y: sy - y,
  };

  engine.freeze();

  cells.filter(cmodel => !cmodel.isLink()).forEach(cmodel => {
    const position = cmodel.position();
    cmodel.position(position.x - offset.x, position.y - offset.y);
  });

  engine.unfreeze();

  // Connect the start/end nodes to the group itself
  let link = new shapes.nebulant.link.Static();
  link.source(group, { port: group.getPortByGroup("in").id });
  link.target(startNode, { port: startNode.getPortByGroup("in").id });
  link.addTo(model).reparent();

  const endNode = group.getEndNode();
  if(endNode) {
    logger.debug(`\tSetting group's [End] node`);
    link = new shapes.nebulant.link.Static();
    link.source(endNode, { port: endNode.getPortByGroup("out-ko").id });
    link.target(group, { port: group.getPortByGroup("out-ko").id });
    link.addTo(model).reparent();

    link = new shapes.nebulant.link.Static();
    link.source(endNode, { port: endNode.getPortByGroup("out-ok").id });
    link.target(group, { port: group.getPortByGroup("out-ok").id });
    link.addTo(model).reparent();
  } else {
    logger.debug(`\tSkipping [End] node`);
  }

  // Simulate element_pointerup event. We want to do this because the
  // entire "grouping" logic is triggered on this event.

  // Deselect all selected elements in order to avoid the creation of a
  // group with unexpected elements inside it.
  engine.selection.collection.reset([]);

  const view = group.findView(engine);
  p = group.getBBox().center();
  view.pointerup({}, p.x, p.y);
}
