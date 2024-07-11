import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Feedback from "react-bootstrap/esm/Feedback";
import FormText from "react-bootstrap/esm/FormText";
import FormLabel from "react-bootstrap/esm/FormLabel";
import FormGroup from "react-bootstrap/esm/FormGroup";
import InputGroup from "react-bootstrap/esm/InputGroup";
import FormControl from "react-bootstrap/esm/FormControl";

import { onChange, triggerIntellisense } from "@src/ui/functionality/common/onChangeHandler";
import { getFormattedValidations } from "@src/ui/functionality/common/getFormattedValidations";

export const DualTextInput = (props) => {
  const { onChange: parentOnChange } = props;

  let { ...attrs } = props.validations;
  let { warnings, errors } = getFormattedValidations(props);

  const warnings1 = warnings?.filter(w => w?.params?.position == 0);
  const errors1 = errors?.filter(w => w?.params?.position == 0);

  const warnings2 = warnings?.filter(w => w?.params?.position == 1);
  const errors2 = errors?.filter(w => w?.params?.position == 1);

  const value = props.form.get(props.path);

  return (
    <FormGroup className={`form-group ${props?.className?.match(/ ?mb-\d/) ? "" : "mb-4" } ${props.className || ""}`} as={Row}>
      {
        props.label && <FormLabel>{props.label}</FormLabel>
      }

      <Col sm={6} className="pe-1">
        <InputGroup>
          {
            props.prefix1 && <InputGroup.Text id={`${props.path}_prefix1`}>{props.prefix1}</InputGroup.Text>
          }

          <FormControl
            id={`${props.path}_0`}
            name={`${props.path}_0`}
            value={value[0]}
            onChange={event => {
              onChange(props, [event.target.value, value[1]]);

              // Hack the props.form.set() to write in the first value of the array
              triggerIntellisense({ ...props, path: props.path + ".0" });

              parentOnChange?.([event.target.value, value[1]]);
            }}
            placeholder={props.placeholder}
            className={`
              ${warnings1?.length ? "is-invalid is-warning" : ""}
              ${errors1?.length ? "is-invalid" : ""}
            `}
          />

          {
            props.suffix1 && <InputGroup.Text id={`${props.path}_suffix1`}>{props.suffix1}</InputGroup.Text>
          }
        </InputGroup>

        <div>
          {
            warnings1?.slice(0, 1).map((err, idx) =>
              <Feedback key={`warning_${attrs.name}_${idx}`} className="d-inline px-2 me-2 warning" type="invalid" tooltip>{err.message}</Feedback>
            )
          }

          {
            errors1?.slice(0, 1).map((err, idx) =>
              <Feedback key={`error_${attrs.name}_${idx}`} className="d-inline px-2 me-2 error" type="invalid" tooltip>{err.message}</Feedback>
            )
          }

          {
            props.help_text1 && <FormText className="text-muted">{props.help_text1}</FormText>
          }
        </div>
      </Col>

      <Col sm={6} className="ps-1">
        <InputGroup>
          {
            props.prefix2 && <InputGroup.Text id={`${props.path}_prefix2`}>{props.prefix2}</InputGroup.Text>
          }

          <FormControl
            id={`${props.path}_1`}
            name={`${props.path}_1`}
            value={value[1]}
            onChange={event => {
              onChange(props, [value[0], event.target.value]);

              // Hack the props.form.set() to write in the second value of the array
              triggerIntellisense({ ...props, path: props.path + ".1" });

              parentOnChange?.([value[0], event.target.value]);
            }}
            placeholder={props.placeholder2}
            className={`
              ${warnings2?.length ? "is-invalid is-warning" : ""}
              ${errors2?.length ? "is-invalid" : ""}
            `}
          />

          {
            props.suffix1 && <InputGroup.Text id={`${props.path}_suffix1`}>{props.suffix1}</InputGroup.Text>
          }

          {
            warnings2?.slice(0, 1).map((err, idx) =>
              <Feedback key={`warning_${attrs.name}_${idx}`} className="warning" type="invalid" tooltip>{err.message}</Feedback>
            )
          }

          {
            errors2?.slice(0, 1).map((err, idx) =>
              <Feedback key={`error_${attrs.name}_${idx}`} type="invalid" tooltip>{err.message}</Feedback>
            )
          }
        </InputGroup>

        <div>
          {
            warnings2?.slice(0, 1).map((err, idx) =>
              <Feedback key={`warning_${attrs.name}_${idx}`} className="d-inline px-2 me-2 warning" type="invalid" tooltip>{err.message}</Feedback>
            )
          }

          {
            errors2?.slice(0, 1).map((err, idx) =>
              <Feedback key={`error_${attrs.name}_${idx}`} className="d-inline px-2 me-2 error" type="invalid" tooltip>{err.message}</Feedback>
            )
          }

          {
            props.help_text2 && <FormText className="text-muted">{props.help_text2}</FormText>
          }
        </div>
      </Col>
    </FormGroup>
  );
};
