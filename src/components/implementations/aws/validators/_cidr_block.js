import { CIDR } from "@src/utils/constants";

export const _cidr_block = (value, context) => {
  if(value.value && !value.value.match(CIDR)) {
    return context.createError({
      type: "warning",
      path: `${context.path}.value`,
      message: "The value doesn't look like a valid CIDR.",
    });
  }

  return true;
}
