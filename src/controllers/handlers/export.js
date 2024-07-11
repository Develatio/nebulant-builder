import { Logger } from "@src/core/Logger";
import { Runtime } from "@src/core/Runtime";
import { EventBus } from "@src/core/EventBus";
import { clone } from "@src/utils/lang/clone";
import { saveAs } from "@src/controllers/handlers/saveAs";
import {
  Migrator as DiagramMigrator,
} from "@src/components/implementations/base/migrators/DiagramDataMigrator";
import {
  generateBlueprint,
} from "@src/components/blueprintGenerators/generateBlueprint";

export const exportBlueprintAsFile = () => {
  const logger = new Logger();
  const runtime = new Runtime();
  const eventBus = new EventBus();
  const engine = runtime.get("objects.engine");

  logger.debug(`The user requested to export the blueprint, let's see what we got...`);

  const { model } = engine;
  const { name } = model.getStartNode().prop("data/settings/parameters");
  //const cm = runtime.get("objects.commandManager");

  const diagram = model.getCleanModel(
    model.getStartNode(),
    "children",
  ).serialize();

  const { actions, min_cli_version, isValid } = generateBlueprint(diagram);

  if(!isValid) {
    eventBus.publish("crash", {
      error: "The blueprint was exported to a file, but it has errors and running it won't be possible, however you'll still be able to import it into the builder and edit it. Check log viewer for details.",
    });
  }

  // Don't forget to save the position of the paper in the blueprint
  const center = engine.scroller.getVisibleArea().center();
  model.set("x", center.x, { skip_undo_stack: true });
  model.set("y", center.y, { skip_undo_stack: true });

  const payload = {
    // TODO: Do we want to include the preview URI here? Maybe some other
    // fields? "encrypted: boolean"?
    blueprint: {
      cm: { undo: [], redo: [] }, // Do we want to export the cm? "cm: cm.toJSON()",
      diagram: model.serialize(),
      diagram_version: new DiagramMigrator().getLatestVersion(),

      n_warnings: runtime.get("state.warn_counter"),
      n_errors: runtime.get("state.err_counter"),

      actions,
      min_cli_version,

      builder_version: process.env.VERSION,
    },
  };

  const tmppayload = clone(payload);
  tmppayload.blueprint.cm = "<json blob>";
  tmppayload.blueprint.diagram = "<json blob>";
  tmppayload.blueprint.actions = "<json blob>";
  logger.debug(JSON.stringify(tmppayload, null, 2));

  const json = process.env.PRODUCTION ? JSON.stringify(payload) : JSON.stringify(payload, null, 2);
  const dataURI = `data:application/json;charset=utf-8,${encodeURIComponent(json)}`;

  saveAs(dataURI, {
    name,
    ext: "nbp",
  });
}
