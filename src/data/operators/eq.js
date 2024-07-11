import { get } from "lodash-es";
import { isEqual } from "@src/utils/lang/isEqual";

export const $eq = ({res, filter_key, value}) => {
  return res.filter(v => {
    const resolved_value = get(v, filter_key);

    return isEqual(resolved_value, value, {
      caseSensitive: true,
    });
  });
}
