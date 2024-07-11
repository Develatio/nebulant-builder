import { Logger } from "@src/core/Logger";
import { clone } from "@src/utils/lang/clone";
import { traverse } from "@src/utils/lang/traverse";

export const updateParameters = ({res, parameters}) => {

  const logger = new Logger();

  Object.entries(parameters).forEach(([replace_key, replace_conditions]) => {

    Object.entries(replace_conditions).forEach(([replacer, value]) => {

      res = res?.filter(model => {
        // We don't want to use models that don't have "parameters" variables.
        return !!model.prop("data")?.settings?.parameters;
      });

      return res.map(v => {
        switch (replacer) {
          case "$value":
            // TODO
            break;

          case "$replace":
            // TODO
            break;

          case "$regex":
            const obj = clone(v.prop("data/settings/parameters"));
            const re = new RegExp(value[0], value[2] || "");

            if(replace_key == "*") {
              traverse(obj).forEach(function(v) {
                if(typeof v == "string") {
                  const res = v.replace(re, value[1]);
                  this.update(res);
                }
              });
            } else {
              try {
                let v = traverse(obj).get(replace_key);
                v = v.replace(re, value[1]);
                traverse(obj).set(replace_key, v);
              } catch(_error) {
                logger.debug("Traversing an object failed: ${error}");
              }
            }

            v.prop("data/settings/parameters", obj, {
              rewrite: true, // don't merge, instead overwrite everything
            });

            break;

          default:
            break;
        }
      });

    });
  });

  return res;
}
