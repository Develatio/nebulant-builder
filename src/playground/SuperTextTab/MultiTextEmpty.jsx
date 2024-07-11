import { useState } from "react";
import { useForm } from "react-form-state-manager";

import { MultiTextInput } from "@src/ui/functionality/MultiTextInput";

const VALIDATION_BODY = {
  warnings: {},
  errors: {},
  isValid: true,
};

export const MultiTextEmpty = (props) => {
  const { disabled } = props;

  const form = useForm({ values: { "my_st_value": [] } });
  const [validations, _] = useState(VALIDATION_BODY);

  return (
    <MultiTextInput
      form={form}
      validations={validations}

      disabled={disabled}
      path={"my_st_value"}
      label={""}
      help_text={""}
      placeholder={""}
    >
    </MultiTextInput>
  );
}
