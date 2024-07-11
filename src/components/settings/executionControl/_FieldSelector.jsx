import { SuperSelect } from "@src/ui/functionality/SuperSelect";
import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";

export const FieldSelector = ({ handleOnChange, value, options }) => {
  options = options.map(value => ({
    ...value,
    value: value.name,
  }));

  value = value ? [value] : [];

  return (
    <SuperSelect
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
