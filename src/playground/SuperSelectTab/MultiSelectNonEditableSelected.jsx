import { useState } from "react";
import { useForm } from "react-form-state-manager";

import { DropdownInput } from "@src/ui/functionality/DropdownInput";
import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";

const VALIDATION_BODY = {
  warnings: {},
  errors: {},
  isValid: true,
};

export const MultiSelectNonEditableSelected = (props) => {
  const { disabled } = props;

  const form = useForm({ values: { "my_ss_value": ["popo", "pupu"] } });
  const [validations, _] = useState(VALIDATION_BODY);

  return (
    <DropdownInput
      form={form}
      validations={validations}

      path={"my_ss_value"}
      editable={false}
      disabled={disabled}
      multi={true}
      label={""}
      help_text={""}
      placeholder={""}
      options={[
        ({ searchPattern, page, perPage, group, pagingDetails }) => {
          let opts = [
            { type: "value", label: "Papa", value: "papa" },
            { type: "value", label: "Popo", value: "popo" },
            { type: "value", label: "Pupu", value: "pupu" },
          ];

          return new StaticAutocompleter({
            data: opts,
            filters: { searchPattern, page, perPage, group, pagingDetails },
          }).run();
        },
      ]}
    >
    </DropdownInput>
  );
}
