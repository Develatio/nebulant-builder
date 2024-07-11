import { useState } from "react";
import { useForm } from "react-form-state-manager";

import { DropdownInput } from "@src/ui/functionality/DropdownInput";
import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";

const VALIDATION_BODY = {
  warnings: {},
  errors: {},
  isValid: true,
};

export const MultiSelectEditableSelected = (props) => {
  const { disabled } = props;

  const form = useForm({ values: { "my_ss_value": ["pepe", "popo {{ runtime }}", "pupu Esto es una prueba para ver como se expande esta gran putisima mierda pinchada en un palo", "pipi", "papa", "pjpj", "pkpk", "plpl", "pñpñ"] } });
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

      groups={[
        { label: "Empiezan por 'pa'", value: "pa", selected: false },
        { label: "Empiezan por 'po'", value: "po", selected: true },
        { label: "Empiezan por 'pu'", value: "pu", selected: false },
        { label: "Empiezan por 'pe'", value: "pe", selected: false },
        { label: "Empiezan por 'pi'", value: "pi", selected: false },
      ]}
      options={[
        ({ searchPattern, page, perPage, group, pagingDetails }) => {
          let opts = [
            { type: "value", label: "Papa", value: "papa" },
            { type: "value", label: "Popo", value: "popo" },
            { type: "value", label: "Pupu", value: "pupu" },
            { type: "value", label: "Pepe", value: "pepe" },
            { type: "value", label: "Pipi", value: "pipi" },

            { type: "value", label: "Papa1", value: "papa1" },
            { type: "value", label: "Popo1", value: "popo1" },
            { type: "value", label: "Pupu1", value: "pupu1" },
            { type: "value", label: "Pepe1", value: "pepe1" },
            { type: "value", label: "Pipi1", value: "pipi1" },

            { type: "value", label: "Papa2", value: "papa2" },
            { type: "value", label: "Popo2", value: "popo2" },
            { type: "value", label: "Pupu2", value: "pupu2" },
            { type: "value", label: "Pepe2", value: "pepe2" },
            { type: "value", label: "Pipi2", value: "pipi2" },
          ];

          if(group) {
            opts = opts.filter(opt => opt.value.startsWith(group));
          }

          return new StaticAutocompleter({
            data: opts,
            filters: { searchPattern, page, perPage, group, pagingDetails },
          }).run();
        },
        //({ searchPattern, page, perPage, group, pagingDetails }) => new KeyPairNameAutocompleter({
        //  node: props.node,
        //  filters: { searchPattern },
        //}),
      ]}
    >
    </DropdownInput>
  );
}
