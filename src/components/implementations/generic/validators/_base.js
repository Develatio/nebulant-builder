import { object, string } from "yup";
import { uniqueOutputName } from "@src/components/implementations/base/validators/fields/uniqueOutputName";
import { allowOnlyBasicChars } from "@src/components/implementations/base/validators/fields/allowOnlyBasicChars";
import { disallowReservedNames } from "@src/components/implementations/base/validators/fields/disallowReservedNames";

export const result = object({
  value: string().required().test(
    allowOnlyBasicChars
  ).test(
    uniqueOutputName
  ).test(
    disallowReservedNames
  ),
  type: string().default(""),
});
