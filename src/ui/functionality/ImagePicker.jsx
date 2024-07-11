import Row from "react-bootstrap/esm/Row";
import Feedback from "react-bootstrap/esm/Feedback";
import FormText from "react-bootstrap/esm/FormText";
import FormLabel from "react-bootstrap/esm/FormLabel";
import FormGroup from "react-bootstrap/esm/FormGroup";
import InputGroup from "react-bootstrap/esm/InputGroup";

import ImagePickerComponent from "@src/ui/functionality/ImagePickerComponent/index";

import { onChange } from "@src/ui/functionality/common/onChangeHandler";
import { getFormattedValidations } from "@src/ui/functionality/common/getFormattedValidations";

export const ImagePicker = (props) => {
  const { onChange: parentOnChange } = props;

  let { ...attrs } = props.validations;
  let { warnings, errors } = getFormattedValidations(props);

  return (
    <FormGroup
      className={`
        form-group
        ${props?.className?.match(/ ?mb-\d/) ? "" : "mb-4" }
        ${props.className || ""}
        image-picker
      `}
      as={Row}
    >
      {
        props.label && <FormLabel>{props.label}</FormLabel>
      }

      <InputGroup>
        <ImagePickerComponent
          config={{
            width: "200px",
            height: "150px",
            cropWidth: 200,
            cropHeight: 150,
            aspectRatio: 4/3,
          }}
          help_text="Image will be downscaled to 200px by 150px"
          imageSrcProp={props.form.get(props.path)}
          imageChanged={(image) => {
            onChange(props, image);
            parentOnChange?.(image);
          }}
        />

      </InputGroup>

      <div className="helpers">
       {
          warnings?.slice(0, 1).map((err, idx) =>
            <Feedback
              key={`warning_${attrs.name}_${idx}`}
              className="d-inline px-2 me-2 warning"
              type="invalid"
              tooltip
            >{err.message}</Feedback>
          )
        }

        {
          errors?.slice(0, 1).map((err, idx) =>
            <Feedback
              key={`error_${attrs.name}_${idx}`}
              className="d-inline px-2 me-2 error"
              type="invalid"
              tooltip
            >{err.message}</Feedback>
          )
        }

        {
          props.help_text && (
            <FormText className="text-muted">{props.help_text}</FormText>
          )
        }
      </div>

    </FormGroup>
  );
}
