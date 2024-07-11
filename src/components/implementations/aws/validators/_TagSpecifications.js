import { object, string, array, number } from "yup";

import { _tags } from "./_tags";

export const TagSpecifications = object({
  TagSpecifications: array().of(object({
    __uniq: number(),
    name: string(),
    value: array().of(string()),
  }).test({
    test: (value, context) => {
      switch (value.name) {
        case "tag":
          return _tags(value, context);
      }

      return true;
    }
  })).default([]),
});
