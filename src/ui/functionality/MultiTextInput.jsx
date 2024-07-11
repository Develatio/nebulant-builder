import Row from "react-bootstrap/esm/Row";
import Feedback from "react-bootstrap/esm/Feedback";
import FormText from "react-bootstrap/esm/FormText";
import FormLabel from "react-bootstrap/esm/FormLabel";
import FormGroup from "react-bootstrap/esm/FormGroup";
import InputGroup from "react-bootstrap/esm/InputGroup";

import { onChange } from "@src/ui/functionality/common/onChangeHandler";
import { getFormattedValidations } from "@src/ui/functionality/common/getFormattedValidations";

import { SuperText } from "./SuperText";

export const MultiTextInput = (props) => {
  const { onChange: parentOnChange } = props;

  let { ...attrs } = props.validations;
  let { warnings, errors } = getFormattedValidations(props);

  return (
    <FormGroup className={`form-group ${props?.className?.match(/ ?mb-\d/) ? "" : "mb-4" } ${props.className || ""}`} as={Row}>
      {
        props.label && <FormLabel>{props.label}</FormLabel>
      }

      <InputGroup>
        <SuperText
          form={props.form}
          path={props.path}
          node={props.node}

          disabled={!!props.disabled}
          placeholder={props.placeholder ? props.placeholder : "Type..."}
          values={props.form.get(props.path)}
          onChange={(values) => {
            onChange(props, values);
            parentOnChange?.(values);
          }}
          className={`
            ${warnings?.length ? "is-invalid is-warning" : ""}
            ${errors?.length ? "is-invalid" : ""}
          `}
        />
      </InputGroup>

      <div className="helpers">
        {
          warnings?.slice(0, 1).map((err, idx) =>
            <Feedback key={`warning_${attrs.name}_${idx}`} className="d-inline px-2 me-2 warning" type="invalid" tooltip>{err.message}</Feedback>
          )
        }

        {
          errors?.slice(0, 1).map((err, idx) =>
            <Feedback key={`error_${attrs.name}_${idx}`} className="d-inline px-2 me-2 error" type="invalid" tooltip>{err.message}</Feedback>
          )
        }

        {
          props.help_text && <FormText className="text-muted">{props.help_text}</FormText>
        }
      </div>

    </FormGroup>
  );
}
