import { useRef, useState, useCallback } from "react";

import { SwatchesPicker, HuePicker } from "react-color";

import Row from "react-bootstrap/esm/Row";
import Feedback from "react-bootstrap/esm/Feedback";
import FormText from "react-bootstrap/esm/FormText";
import FormLabel from "react-bootstrap/esm/FormLabel";
import FormGroup from "react-bootstrap/esm/FormGroup";
import InputGroup from "react-bootstrap/esm/InputGroup";
import FormControl from "react-bootstrap/esm/FormControl";

import { useClickAnywhere } from "@src/utils/react/useClickAnywhere";
import { onChange, triggerIntellisense } from "@src/ui/functionality/common/onChangeHandler";
import { getFormattedValidations } from "@src/ui/functionality/common/getFormattedValidations";

export const ColorPicker = (props) => {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  const { onChange: parentOnChange } = props;

  let { ...attrs } = props.validations;
  let { warnings, errors } = getFormattedValidations(props);

  const handleClickOutside = useCallback((e) => {
    if(ref && !ref.current.contains(e.target)) {
      setVisible(false);
    }
  }, []);
  useClickAnywhere(handleClickOutside);

  return (
    <FormGroup className={`form-group ${props?.className?.match(/ ?mb-\d/) ? "" : "mb-4" } ${props.className || ""} color-picker`} as={Row}>
      {
        props.label && <FormLabel>{props.label}</FormLabel>
      }

      <InputGroup ref={ref}>
        <FormControl
          id={props.path}
          name={props.path}
          as="input"
          placeholder={props.placeholder}
          {...props.readonly && {disabled: true}}
          value={props.value ?? props.form.get(props.path)}
          onFocus={() => setVisible(true)}
          onChange={(event) => {
            onChange(props, event.target.value);
            triggerIntellisense(props);
            parentOnChange?.(event.target.value);
          }}
          className={`
            ${warnings?.length ? "is-invalid is-warning" : ""}
            ${errors?.length ? "is-invalid" : ""}
          `}
        />

        <div className="color-preview-wrapper pointer" onClick={() => setVisible(true)}>
          <div className="color-preview" style={{
            backgroundColor: `${props.value ?? props.form.get(props.path)}`,
          }}></div>
        </div>

        {
          visible && (
            <div className="position-absolute pickers-wrapper">
              <div className="hue-picker">
                <HuePicker
                  width={"auto"}
                  color={props.value ?? props.form.get(props.path)}
                  onChange={(value) => onChange(props, value.hex)}
                />
              </div>
              <SwatchesPicker
                width={"auto"}
                onChange={(value) => onChange(props, value.hex)}
              />
            </div>
          )
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
