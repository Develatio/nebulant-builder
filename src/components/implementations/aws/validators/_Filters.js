import { object, array, string, number, mixed } from "yup";

import { _tags } from "./_tags";
import { _cidr_block } from "./_cidr_block";

export const Filters = object({
  Filters: array().of(object({
    __uniq: number(),
    name: string(),
    value: mixed(),
  }).test({
    test: (value, context) => {
      switch (value.name) {
        case "cidr-block":
          return _cidr_block(value, context);

        case "tag":
          return _tags(value, context);
      }

      return true;
    }
  })).default([])
});
