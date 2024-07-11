import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Feedback from "react-bootstrap/esm/Feedback";
import FormText from "react-bootstrap/esm/FormText";
import FormLabel from "react-bootstrap/esm/FormLabel";
import FormGroup from "react-bootstrap/esm/FormGroup";
import FormCheck from "react-bootstrap/esm/FormCheck";
import InputGroup from "react-bootstrap/esm/InputGroup";

import { onChange } from "@src/ui/functionality/common/onChangeHandler";
import { getFormattedValidations } from "@src/ui/functionality/common/getFormattedValidations";

export const CheckboxInput = (props) => {
  const { onChange: parentOnChange } = props;

  let { ...attrs } = props.validations;
  let { warnings, errors } = getFormattedValidations(props);

  return (
    <FormGroup className={`form-group ${props?.className?.match(/ ?mb-\d/) ? "" : "mb-4" } ${props.className || ""}`} as={Row}>
      {
        props.label && <FormLabel >{props.label}</FormLabel>
      }

      <InputGroup>
        <FormCheck
          id={props.path}
          name={props.path}
          type="switch"
          {...props.readonly && {disabled: true}}
          checked={props.checked ?? props.form.get(props.path)}
          onChange={event => {
            onChange(props, event.target.checked);
            parentOnChange?.(event.target.checked);
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


export const HCheckboxInput = (props) => {
  let { ...attrs } = props.validations;
  let { warnings, errors } = getFormattedValidations(props);

  return (
    <FormGroup className={`form-group ${props?.className?.match(/ ?mb-\d/) ? "" : "mb-4" } ${props.className || ""}`} as={Row}>
      <Col sm={12}>
        <Row className="flex-row flex-nowrap align-items-center">
          <InputGroup className="w-auto">
            <FormCheck
              id={props.path}
              name={props.path}
              type="switch"
              {...props.readonly && {disabled: true}}
              checked={props.checked ?? props.form.get(props.path)}
              onChange={event => onChange(props, event.target.checked)}
              className={`
                ${warnings?.length ? "is-invalid is-warning" : ""}
                ${errors?.length ? "is-invalid" : ""}
              `}
            />
          </InputGroup>

          {
            props.label && <FormLabel className="mb-0 w-auto">{props.label}</FormLabel>
          }
        </Row>
      </Col>

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
