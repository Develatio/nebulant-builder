import { get } from "lodash-es";
import { DiagramQL } from "@src/data/DiagramQL";

export const uniqueOutputName = {
  name: "warning",
  message: "This action will overwrite a variable that has been defined in a previous action.",
  test: (value, context) => {
    // If no value was passed, there's nothing we can check.
    if(!value) {
      return true;
    }

    // If neither context or node_id were passed, there's nothing we can check.
    if(!context.options?.context || !context.options.context?.node_id) {
      return true;
    }

    const dql = new DiagramQL();

    // By filtering only the parents of the current node ("node_id"), we can be
    // more precise about re-declared variables.
    const filter = `: {
      "parentsOf": ${dql.escape(context.options.context.node_id)}
    }`;

    // If we have a "form" object in the context it means that we're validating
    // a form that is being live-edited.
    if(context.options?.context?.form) {
      const initialValues = context.options.context.form.initialValues;
      const originalValue = get(initialValues, context.path);

      // If there wasn't any previous value, just validate the current value.
      if(!originalValue) {
        return dql.query(`
          nodes${filter} | outputVars | find : {
            "value": {
              "$eqi": ${dql.escape(value)}
            }
          } | count
        `) == 0;
      }

      // ...if the current value is equal to the initial value, search (the
      // parents) for any output variable with the same name.
      if(originalValue.toLowerCase() == value.toLowerCase()) {
        return dql.query(`
          nodes${filter} | outputVars | find : {
            "value": {
              "$eqi": ${dql.escape(value)}
            }
          } | count
        `) == 0;
      }

      // ... else, search (the parents) for any output variable that does NOT
      // match the initial value and matches the current value.
      else {
        return dql.query(`
          nodes${filter} | outputVars | find : {
            "value": {
              "$neqi": ${dql.escape(originalValue)},
              "$eqi": ${dql.escape(value)}
            }
          } | count
        `) == 0;
      }
    }

    // We're validating a raw node, so just get it's value and search for other
    // output variables with the same name.
    else {
      return dql.query(`
        nodes${filter} | outputVars | find : {
          "value": {
            "$eqi": ${dql.escape(value)}
          }
        } | count
      `) == 0;
    }
  }
};
