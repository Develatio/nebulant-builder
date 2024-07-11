import { useCallback, useState, memo, forwardRef } from "react";

import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Feedback from "react-bootstrap/esm/Feedback";
import FormText from "react-bootstrap/esm/FormText";
import FormLabel from "react-bootstrap/esm/FormLabel";
import FormGroup from "react-bootstrap/esm/FormGroup";
import InputGroup from "react-bootstrap/esm/InputGroup";
import FormControl from "react-bootstrap/esm/FormControl";

import { getFormattedValidations } from "@src/ui/functionality/common/getFormattedValidations";
import { onChangeNumeric, triggerIntellisense } from "@src/ui/functionality/common/onChangeHandler";

const Input = ({
  classes,
  onChange,
  onMouseUpOrTouchEnd,
  onTouchEnd,
  onMouseUp,
  ...rest
}) => (
  <input
    type="range"
    onChange={(ev) => onChange(ev, ev.target.valueAsNumber)}
    onMouseUp={(ev) => {
      onMouseUpOrTouchEnd(ev);
      if(onMouseUp) onMouseUp(ev);
    }}
    onTouchEnd={(ev) => {
      onMouseUpOrTouchEnd(ev);
      if(onTouchEnd) onTouchEnd(ev);
    }}
    className={classes}
    {...rest}
  />
);

const InputMemo = memo(Input);

const RangeSlider = forwardRef(({
  size,
  disabled = false,
  value,
  onChange = () => {},
  onAfterChange = () => {},
  min,
  max,
  sliderPrefix,
  sliderSuffix,
  step,
  variant = "primary",
  inputProps = {},
  className,
}, ref) => {

  const [ prevValue, setPrevValue ] = useState();
  const prefix = "range-slider";

  const classes = `
    ${prefix}
    ${className}
    ${size ? prefix + "--" + size : ""}
    ${disabled ? "disabled" : ""}
    ${variant ? prefix + "--" + variant : ""}
  `;

  const { onMouseUp, onTouchEnd, ...restInputProps } = inputProps;

  const onMouseUpOrTouchEnd = useCallback(ev => {
    if(prevValue !== ev.target.value) onAfterChange(ev, ev.target.valueAsNumber);
    setPrevValue(ev.target.value);
  }, [ prevValue, onAfterChange ]);

  return (
    <div className="d-flex align-items-center w-100 me-3">
      <FormText className="text-muted pe-2 mt-0 text-nowrap">{sliderPrefix}{min}{sliderSuffix}</FormText>
      <InputMemo
        {...{
          disabled,
          value,
          min,
          max,
          ref,
          step,
          classes,
          onMouseUpOrTouchEnd,
          onTouchEnd,
          onMouseUp,
          onChange,
          ...restInputProps,
        }}
      />
      <FormText className="text-muted ps-2 mt-0 text-nowrap">{sliderPrefix}{max}{sliderSuffix}</FormText>
    </div>
  );
});

export const RangeInput = (props) => {
  const { onChange: parentOnChange } = props;

  let { ...attrs } = props.validations;
  let { warnings, errors } = getFormattedValidations(props);

  return (
    <FormGroup className={`form-group ${props?.className?.match(/ ?mb-\d/) ? "" : "mb-4" } ${props.className || ""}`} as={Row}>
      {
        props.label && <FormLabel>{props.label}</FormLabel>
      }

      <Col sm={12} className="d-flex">
        <RangeSlider
          id={props.path}
          name={props.path}
          type="range"
          min={props.min || 0}
          max={props.max || 100}
          {...props.readonly && {disabled: true}}
          sliderPrefix={props.sliderPrefix || ""}
          sliderSuffix={props.sliderSuffix || ""}
          placeholder={props.placeholder}
          value={props.value ?? props.form.get(props.path)}
          onChange={event => {
            onChangeNumeric(props, event.target.value);
            parentOnChange?.(event.target.value);
          }}
          className={`
            ${warnings?.length ? "is-invalid is-warning" : ""}
            ${errors?.length ? "is-invalid" : ""}
          `}
        />

        <InputGroup className="w-auto">
          {
            props.prefix && <InputGroup.Text id={`${props.path}_prefix`}>{props.prefix}</InputGroup.Text>
          }

          <FormControl
            id={`${props.path}_input`}
            name={`${props.path}_input`}
            placeholder={props.placeholder}
            {...props.readonly && {disabled: true}}
            value={props.value ?? props.form.get(props.path)}
            onChange={event => {
              onChangeNumeric(props, event.target.value);
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
      </Col>

      <Col sm={12} className="helpers">
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
      </Col>
    </FormGroup>
  );
}
