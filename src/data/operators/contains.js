import { get } from "lodash-es";

export const $contains = ({res, filter_key, value}) => {
  return res.filter(v => {
    const resolved_value = get(v, filter_key);

    let s = String(value); // create a copy, avoid modifying the original value

    let res;
    if(Array.isArray(resolved_value)) {
      res = resolved_value.some(el => el == s);
    } else { // This is a string
      res = resolved_value.indexOf(s) > -1;
    }

    return res;
  });
}
