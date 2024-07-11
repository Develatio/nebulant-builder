const TYPES_MAP = {
  "boolean": "boolean",
  "text": "string",
  "textarea": "string",
  "selectable-dql-var-type": "selectable-variables",
  "selectable-static": "selectable-static-values",
};

export const convert_to_vars_struct = (arr) => {
  return arr?.reduce((acc, { value }) => {
    const obj = {
      key: value.name,
      ask_at_runtime: value.ask_at_runtime,
      required: value.required,
      type: TYPES_MAP[value.type],
      stack: value.stack,
    };

    if(value.type === "boolean") {
      obj.value = value.bool_value;
    } else if(value.type === "text" || value.type === "textarea") {
      obj.value = value.value;
    } else if(value.type === "selectable-static") {
      obj.options = value.options.reduce((acc, currv) => {
        acc.push({
          label: currv.value[0],
          value: currv.value[1],
        });
        return acc;
      }, []);
    } else if(value.type == "selectable-dql-var-type") {
      obj.options = value.vars; // TODO <- rework this ¿?
    }

    acc.push(obj);
    return acc;
  }, []);
}
