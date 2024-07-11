import { Logger } from "@src/core/Logger";

export const parameterVars = ({res}) => {
  try {
    res = res
      ?.filter(model => {
        // We don't want to use models that don't have "parameters" variables.
        return !!model.prop("data")?.settings?.parameters;
      })
      // Object.values(models) will get us all the models of the active layer.
      // .map(model) will let us extract only the parts that we want from
      // each model.
      .map((model) => ({
        // We want to get the "parameters" object, which is a hashmap containing
        // all the data related to the parameters used by each one of our
        // nodes.
        ...model.prop("data").settings.parameters,

        // We also want to return the ID of the node, so we can keep the
        // possibility of finding the node to which this parameter belongs.
        __node_id: model.id,
      }))
      // We want to add all the objects in one single array.
      .reduce((acc, output) => acc.concat(output), []);
  } catch (err) {
    const logger = new Logger();
    logger.error(err);
    res = null;
  }

  return res;
}
