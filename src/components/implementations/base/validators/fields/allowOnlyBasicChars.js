import { OUTPUT_VAR_CHARS } from "@src/utils/constants";

export const allowOnlyBasicChars = {
  name: "error",
  message: "Only upper and lowercase letters, numbers, '_' and '-' are allowed",
  test: (value = "") => OUTPUT_VAR_CHARS.test(value),
};
