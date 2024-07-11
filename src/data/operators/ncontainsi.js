import { get } from "lodash-es";

export const $ncontainsi = ({res, filter_key, value}) => {
  return res.filter(v => {
    const resolved_value = get(v, filter_key);

    let s = String(value).toLowerCase(); // create a copy, avoid modifying the original value

    let res;
    if(Array.isArray(resolved_value)) {
      res = resolved_value.some(el => String(el).toLowerCase() == s);
    } else { // This is a string
      res = resolved_value.toLowerCase().indexOf(s) > -1;
    }

    return !res;
  });
}
