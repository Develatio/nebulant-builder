import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { CheckboxInput } from "@src/ui/functionality/CheckboxInput";
import { DropdownInput } from "@src/ui/functionality/DropdownInput";

import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";

export const Waiters = (props) => {
  const async = props.form.get("outputs.result.async");

  return (
    <Row className={`
      bg-almost-dark px-2 py-3 border rounded
      ${props.className || ""}
    `}>
      <Col sm={4}>
        <CheckboxInput
          form={props.form}
          validations={props.validations}
          className="mb-0"
          path={"outputs.result.async"}
          label={"Async"}
          help_text={props.toggle_help_text || "Don't wait for the action to be fully completed"}
        ></CheckboxInput>
      </Col>

      <Col sm={8}>
        {
          (!props.options?.length || async) ? "" : (
            <DropdownInput
              form={props.form}
              validations={props.validations}
              className="mb-0"
              path={"outputs.result.waiters"}
              editable={false}
              multi={true}
              label={"Wait for state(s)"}
              help_text={props.dropdown_help_text}
              placeholder={"Select one or more states"}
              options={[
                ({ searchPattern, page, perPage, group, pagingDetails }) => {
                  return new StaticAutocompleter({
                    data: props.options,
                    filters: { searchPattern, page, perPage, group, pagingDetails },
                  }).run();
                },
              ]}
            ></DropdownInput>
          )
        }
      </Col>
    </Row>
  );
}
