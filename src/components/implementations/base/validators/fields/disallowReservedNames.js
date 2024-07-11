const reserved = ["ENV"];
export const disallowReservedNames = {
  name: "error",
  message: "This name is reserved.",
  test: (value = "") => !reserved.includes(value.toUpperCase()),
};
