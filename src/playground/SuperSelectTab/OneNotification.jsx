import { useState } from "react";
import { useForm } from "react-form-state-manager";

import { DropdownInput } from "@src/ui/functionality/DropdownInput";
import { CliConnectivity } from "@src/ui/functionality/Dropdown/Notifications/CliConnectivity";
import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";

const VALIDATION_BODY = {
  warnings: {},
  errors: {},
  isValid: true,
};

export const OneNotification = (props) => {
  const { disabled } = props;

  const form = useForm({ values: { "my_ss_value": ["pepe", "popo"] } });
  const [validations, _] = useState(VALIDATION_BODY);

  return (
    <DropdownInput
      form={form}
      validations={validations}

      path={"my_ss_value"}
      editable={true}
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
            { type: "value", label: "Pepe", value: "pepe" },
            { type: "value", label: "Pipi", value: "pipi" },
          ];

          return new StaticAutocompleter({
            data: opts,
            filters: { searchPattern, page, perPage, group, pagingDetails },
          }).run();
        },
      ]}
      notifications={
        <>
          <CliConnectivity />
        </>
      }
    >
    </DropdownInput>
  );
}
