import { util } from "@joint/core";

export const nodes = ({res, model, parameters}) => {
  parameters = util.merge({}, parameters);

  // "nodes" accepts an object, which can be used to filter nodes.
  // Currently there are two keys that might trigger said filtering:
  // "parentsOf" and "childrenOf".
  // The value of either of these keys must contain a node ID.
  let allowed_ids = [];
  const direction = parameters.parentsOf ? "parents" : "children";

  const node = model.getCell(parameters.childrenOf || parameters.parentsOf);

  // If we can't find "node" it means that we're most probably trying to run
  // DQL queries in a model different than main_model
  if(node) {
    model.getConnectedElements(node, direction).forEach(n => allowed_ids.push(n.id));
    res = res.filter(model => allowed_ids.includes(model.id));
  }

  return res;
}
