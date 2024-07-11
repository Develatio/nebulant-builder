import { util } from "@joint/core";
import { isEqualWith } from "lodash-es";

export const isEqual = (x, y, opts = { caseSensitive: false }) => {
  if(opts.caseSensitive) {
    return util.isEqual(x, y);
  } else {
    return isEqualWith(x, y, (a, b) => {
      if(util.isString(a) && util.isString(b)) {
        return a.toLowerCase() === b.toLowerCase();
      } else {
        return undefined;
      }
    });
  }
}
