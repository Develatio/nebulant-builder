import { Logger } from "@src/core/Logger";

export const outputVars = ({res}) => {
  try {
    res = res
      ?.filter(model => {
        // We don't want to use models that don't have "outputs" variables.
        return !!model.prop("data")?.settings?.outputs;
      })
      // Object.values(models) will get us all the models of the active layer.
      // .map(model) will let us extract only the parts that we want from
      // each model.
      .map((model) => {
        // We want to get the "outputs" object, which is a hashmap containing
        // all the data related to the values returned by each one of our
        // nodes.
        return Object.entries(model.prop("data").settings.outputs).map(([output_name, output_obj]) => ({
          ...output_obj,
          // We also want to return the ID of the node, so we can keep the
          // possibility of finding the node to which this output variable
          // belongs.
          __node_id: model.id,

          // We also want to return the name of the output variable itself,
          // so we can create a unique and deterministic ID of this output
          // variable (for this specific node).
          __output_name: output_name,

          // Attach the version
          __version: model.prop("data").version,

          // Attach the label of the action
          __label: model.prop("label"),
        }));
      })
      // We want to add all the objects in one single array.
      .reduce((acc, output) => acc.concat(output), []);
  } catch (err) {
    const logger = new Logger();
    logger.error(err);
    res = null;
  }

  return res;
}
