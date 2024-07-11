import Row from "react-bootstrap/esm/Row";
import Feedback from "react-bootstrap/esm/Feedback";
import FormText from "react-bootstrap/esm/FormText";
import FormLabel from "react-bootstrap/esm/FormLabel";
import FormGroup from "react-bootstrap/esm/FormGroup";
import InputGroup from "react-bootstrap/esm/InputGroup";
import FormControl from "react-bootstrap/esm/FormControl";

import { onChange, triggerIntellisense } from "@src/ui/functionality/common/onChangeHandler";
import { getFormattedValidations } from "@src/ui/functionality/common/getFormattedValidations";

export const TextInput = (props) => {
  const { onChange: parentOnChange } = props;

  let { ...attrs } = props.validations;
  let { warnings, errors } = getFormattedValidations(props);

  return (
    <FormGroup className={`form-group ${props?.className?.match(/ ?mb-\d/) ? "" : "mb-4" } ${props.className || ""}`} as={Row}>
      {
        props.label && <FormLabel>{props.label}</FormLabel>
      }

      <InputGroup>
        {
          props.prefix && <InputGroup.Text id={`${props.path}_prefix`}>{props.prefix}</InputGroup.Text>
        }

        <FormControl
          autoFocus={props.autoFocus}
          id={props.path}
          name={props.path}
          as={props.as || "input"}
          {...props.rows && {rows: props.rows}}
          {...props.disabled && {disabled: true}}
          autoComplete={props.autoComplete || "on"}
          placeholder={props.placeholder}
          {...props.readonly && {disabled: true}}
          value={props.value ?? props.form.get(props.path)}
          onChange={event => {
            onChange(props, event.target.value);
            triggerIntellisense(props);
            parentOnChange?.(event.target.value);
          }}
          className={`
            ${warnings?.length ? "is-invalid is-warning" : ""}
            ${errors?.length ? "is-invalid" : ""}
          `}
        />

        {
          props.suffix && <InputGroup.Text id={`${props.path}_suffix`}>{props.suffix}</InputGroup.Text>
        }
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
