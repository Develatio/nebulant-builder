import { object, array, string, number, mixed } from "yup";

export const Filters = object({
  Filters: array().of(object({
    __uniq: number(),
    name: string(),
    value: mixed(),
  })).default([])
});
