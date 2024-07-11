import { get } from "lodash-es";

export const $nregexi = ({res, filter_key, value}) => {
  return res.filter(v => {
    const resolved_value = get(v, filter_key);

    const re = new RegExp(value, "i");

    let res;
    if(Array.isArray(resolved_value)) {
      res = resolved_value.some(el => re.test(el));
    } else { // This is a string
      res = re.test(resolved_value);
    }

    return !res;
  });
}
