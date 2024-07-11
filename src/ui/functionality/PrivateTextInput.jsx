import { useState } from "react";

import Row from "react-bootstrap/esm/Row";
import Button from "react-bootstrap/esm/Button";
import Feedback from "react-bootstrap/esm/Feedback";
import FormText from "react-bootstrap/esm/FormText";
import FormLabel from "react-bootstrap/esm/FormLabel";
import FormGroup from "react-bootstrap/esm/FormGroup";
import InputGroup from "react-bootstrap/esm/InputGroup";
import FormControl from "react-bootstrap/esm/FormControl";

import { Icon } from "@src/ui/functionality/Icon";

import { onChange, triggerIntellisense } from "@src/ui/functionality/common/onChangeHandler";
import { getFormattedValidations } from "@src/ui/functionality/common/getFormattedValidations";

import ShowPasswordIcon from "@src/assets/img/icons/control/show-password.svg?transform";
import HidePasswordIcon from "@src/assets/img/icons/control/hide-password.svg?transform";

export const PrivateTextInput = (props) => {
  const [muted, setMuted] = useState(true);

  const { onChange: parentOnChange } = props;

  let { ...attrs } = props.validations;
  let { warnings, errors } = getFormattedValidations(props);

  const value = props.value ?? props.form.get(props.path);

  return (
    <FormGroup className={`form-group ${props?.className?.match(/ ?mb-\d/) ? "" : "mb-4" } ${props.className || ""} private-text`} as={Row}>
      {
        props.label && <FormLabel className="pe-0">{props.label}</FormLabel>
      }

      <InputGroup>
        {
          props.prefix && <InputGroup.Text id={`${props.path}_prefix`}>{props.prefix}</InputGroup.Text>
        }

        <FormControl
          id={props.path}
          name={props.path}
          as={props.as || "input"}
          type={`${muted ? "password" : ""}`}
          autoComplete="off"
          placeholder={props.placeholder}
          {...props.readonly && {disabled: true}}
          value={value}
          onChange={event => {
            onChange(props, event.target.value);
            triggerIntellisense(props);
            parentOnChange?.(event.target.value);
          }}
          className={`
            ${warnings?.length || errors?.length ? "border-end-0" : ""}
            ${muted && !!value ? "muted" : ""}
            ${warnings?.length ? "is-invalid is-warning" : ""}
            ${errors?.length ? "is-invalid" : ""}
          `}
        />

        {
          props.suffix && <InputGroup.Text id={`${props.path}_suffix`}>{props.suffix}</InputGroup.Text>
        }

        <Button
          variant="link"
          id={`${props.path}_button`}
          className={`
            ${warnings?.length || errors?.length ? "border border-start-0" : ""}
            ${warnings?.length ? "border-warning" : ""}
            ${errors?.length ? "border-danger" : ""}
          `}
        >
          <Icon className="d-flex align-items-center" onClick={() => setMuted(!muted)}>
            { muted ? <HidePasswordIcon /> : <ShowPasswordIcon /> }
          </Icon>
        </Button>
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
