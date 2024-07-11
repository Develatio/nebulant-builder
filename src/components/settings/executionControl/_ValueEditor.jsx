import { useEffect } from "react";

import { SuperSelect } from "@src/ui/functionality/SuperSelect";
import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";

export const ValueEditor = ({
  operator,
  value,
  handleOnChange,
  className,
  inputType,
  values,
}) => {
  // This side effect blanks out the value if the inputType is "number",
  // the operator is not "between" and not "notBetween",
  // and the value contains a comma.
  useEffect(() => {
    if(
      inputType === "number" &&
      !["between", "notBetween"].includes(operator) &&
      typeof value === "string" &&
      value.includes(",")
    ) {
      handleOnChange("");
    }
  }, [handleOnChange, inputType, operator, value]);

  if(operator === "null" || operator === "notNull") {
    return null;
  }

  const options = values.map(value => ({
    ...value,
    value: value.name,
  }));

  value = value ? [value] : [];

  return (
    <SuperSelect
      className={className}
      placeholder={"Select a variable or type a value"}
      multi={false}
      editable={true}
      values={value}
      onChange={values => handleOnChange(values[0])}
      options={[
        ({ searchPattern, page, perPage, group, pagingDetails }) => {
          return new StaticAutocompleter({
            data: options,
            filters: { searchPattern, page, perPage, group, pagingDetails },
          }).run();
        },
      ]}
    />
  );
};
