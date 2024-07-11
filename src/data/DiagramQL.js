// Ok, ok... listen... sshhhh.... listen!!
// No, this is not achievable with IndexedDB. This is querying the model of
// BackboneJS, which is what JointJS is built on top of.
// Also, no, copying the model over to IndexedDB and then querying it there is
// not feasible. Keeping both models in-sync would be a nightmare and I swear to
// god I had enough with the rest of the stuff in this project. I'm not doing it
// with IndexedDB.

import { Logger } from "@src/core/Logger";
import { Runtime } from "@src/core/Runtime";
import { clone } from "@src/utils/lang/clone";

import { find, findInValues } from "@src/data/commands/find";
import { first } from "@src/data/commands/first";
import { last } from "@src/data/commands/last";
import { count } from "@src/data/commands/count";
import { nodes } from "@src/data/commands/nodes";
import { outputVars } from "@src/data/commands/outputVars";
import { parameterVars } from "@src/data/commands/parameterVars";
import { updateParameters } from "@src/data/commands/updateParameters";
import { toDropdownValues } from "@src/data/commands/toDropdownValues";

import { DQLCommonQueries } from "@src/data/DQLCommonQueries";

export class DiagramQL extends DQLCommonQueries {
  constructor(model = null) {
    super();

    this.res = null;
    this.model = model;

    this.logger = new Logger();
    this.runtime = new Runtime();

    this.commands = {
      nodes,
      parameterVars,
      outputVars,
      find,
      findInValues,
      first,
      last,
      count,
      updateParameters,
      toDropdownValues,
    }

    return this;
  }

  getModel() {
    if(this.model) {
      return this.model;
    }

    const model = this.runtime.get("objects.main_model");
    if(!model) {
      this.logger.error("DiagramQL is being used without a model.");
      return null;
    }

    return model;
  }

  escape(value) {
    return JSON.stringify(value);
  }

  // Usually we'd like the result to be cloned in order to avoid accidental
  // modifications (remember: JavaScript uses references, not values, for all
  // non-primitive data types, which means that callees are able to modify the
  // underlying data by using the results we're returning).
  //
  // There might be some corner cases in which we'd actually want to return
  // these references, so we can then operate on the actual model of the engine.
  // Example: Search for a particular node, then set it's "selected" state by
  // calling it's ".setSelected()" method.
  query(dql, cloneResult = true) {
    let t1;
    if(typeof performance !== "undefined") {
      t1 = performance.now();
    } else {
      t1 = Date.now();
    }

    dql = dql.replace(/\s\s+/g, " ");
    this.logger.debug(`DQL query: ${dql}`);
    const chunks = dql.split("|");

    // Prepare initial data
    const model = this.getModel();
    if(!model) {
      this.logger.debug("DQL query won't be executed, no data model found.");
      return [];
    }

    // This gets all elements
    //this.res = model.getElements();

    // This gets the "Start" node itself and all it's children (excluding
    // disconnected nodes).
    // Note: We want to spread the result in order to force a conversion from
    // Set to Array.
    this.res = [...model.getConnectedElements()];
    const start = model.getStartNode();
    if(start) this.res.unshift(start);

    // We use "some" instead of "forEach" so that we can short-circuit the
    // iteration loop if any of the chunks contains an error.
    chunks.some(chunk => {
      let command = chunk;
      let parameters = null;

      // check if we have params
      if(chunk.split(":").length > 1) {
        let [op, params_exp] = chunk.split(/:(.+)/);
        command = op;
        try {
          parameters = JSON.parse(params_exp);
        } catch (_) {
          this.logger.critical(`Broken DQL expression: ${params_exp}`);
          this.res = [];

          return true; // returning "true" will abort the iteration loop
        }
      }

      command = command.trim();

      if(parameters != null) {
        this.res = this.commands[command]({res: this.res, model, parameters});
      } else {
        this.res = this.commands[command]({res: this.res, model});
      }
    });

    // We can NEVER stringify an entire node (if we try to do so, a circular
    // reference error will occur)
    if(!chunks[0].trim().startsWith("nodes") && cloneResult) {
      this.res = clone(this.res);
    }

    let t2;
    if(typeof performance !== "undefined") {
      t2 = performance.now();
    } else {
      t2 = Date.now();
    }

    let s = `DQL query finished in ${(t2 - t1).toFixed(1)}ms`;
    if(Array.isArray(this.res)) {
      s += `, ${this.res.length} results`;
    }
    this.logger.debug(s);

    return this.res;
  }
}
