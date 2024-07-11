import Row from "react-bootstrap/esm/Row";
import Feedback from "react-bootstrap/esm/Feedback";
import FormText from "react-bootstrap/esm/FormText";
import FormLabel from "react-bootstrap/esm/FormLabel";
import FormGroup from "react-bootstrap/esm/FormGroup";
import InputGroup from "react-bootstrap/esm/InputGroup";
import FormControl from "react-bootstrap/esm/FormControl";

import { getFormattedValidations } from "@src/ui/functionality/common/getFormattedValidations";

export const OutputVariable = (props) => {
  let { ...attrs } = props.validations;
  let { warnings, errors } = getFormattedValidations(props);

  const onChange = (e) => {
    const value = (e.target.value || "").replace(/[^A-Za-z0-9_-]/g, "");
    props.form.set(props.path, value);
    props.form.setTouched(props.path, true);
  }

  return (
    <FormGroup className="form-group mb-4" as={Row}>
      <FormLabel>{props.label}</FormLabel>

      <InputGroup>
        <FormControl
          id={props.path}
          name={props.path}
          value={props.form.get(props.path)}
          onChange={(e) => onChange(e)}
          placeholder={props.placeholder || "Type the name you'd like to use to refer to this variable"}
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

        <FormText className="text-muted">{props.help_text || "Only upper and lowercase letters, numbers, '_' and '-' are allowed"}</FormText>
      </div>

    </FormGroup>
  );
}
