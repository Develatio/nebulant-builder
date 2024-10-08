import { get } from "lodash-es";
import { clone } from "@src/utils/lang/clone";

export const $in = ({res, filter_key, value}) => {
  return res.filter(v => {
    const resolved_value = get(v, filter_key);

    let arr = clone(value);

    let res;
    if(Array.isArray(resolved_value)) {
      res = resolved_value.some(v => arr.includes(v));
    } else {
      res = arr.includes(resolved_value);
    }

    return res;
  });
}
