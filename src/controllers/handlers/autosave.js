import Url from "@src/utils/domurl";
import { Logger } from "@src/core/Logger";
import { Runtime } from "@src/core/Runtime";
import { content_path_parser } from "@src/utils/content_path_parser";

export const autosave = () => {
  const logger = new Logger();
  const runtime = new Runtime();
  const backendConnector = runtime.get("objects.backendConnector");

  // Check if logged in...
  const me = runtime.get("state.myself");
  if(!me) return;

  // Check if we're editing a blueprint
  const url = new Url();
  const { blueprint_uri } = url.query;
  if(!blueprint_uri) return;

  const {
    isValid,
    organization_slug,
    collection_slug,
    blueprint_slug,
    version,
  } = content_path_parser(blueprint_uri);

  // We don't want to autosave if:
  // * the blueprint_uri is invalid
  // * the blueprint doesn't belong to the user's organization
  // * this is a snapshot. Snapshots are read-only!
  if(!isValid || organization_slug !== me.current_organization.slug || version) return;

  // Check if there are any changes
  const ops_counter = runtime.get("state.ops_counter");
  if(ops_counter == 0) return;

  logger.info("Autosaving blueprint...");

  const model = runtime.get("objects.main_model");
  const cm = runtime.get("objects.commandManager");

  // Don't forget to save the position of the paper in the blueprint
  const engine = runtime.get("objects.engine");
  const center = engine.scroller.getVisibleArea().center();
  model.set("x", center.x, { skip_undo_stack: true });
  model.set("y", center.y, { skip_undo_stack: true });

  const pm = runtime.get("state.pristineBlueprint");
  const blueprint = {
    cm: pm.cm,
    diagram: pm.diagram,
    diagram_version: pm.diagram_version,

    autosave_cm: cm.toJSON(),
    autosave_diagram: model.serialize(),
    autosave_diagram_version: pm.autosave_diagram_version,

    n_errors: pm.n_errors,
    n_warnings: pm.n_warnings,

    actions: pm.actions,
    min_cli_version: pm.min_cli_version,

    builder_version: process.env.VERSION,
  };

  // we don't need to update the preview since this is an autosave
  backendConnector.saveBlueprint({
    collection_slug,
    blueprint_slug,
    blueprint,
  }).catch(_ => {
    logger.error("Error while autosaving blueprint");
  });
}
