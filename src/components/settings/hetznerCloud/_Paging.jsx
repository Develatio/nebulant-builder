import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { NumericInput } from "@src/ui/functionality/NumericInput";

export const Paging = (props) => {
  return (
    <Row className={`
      bg-almost-dark px-2 py-3 border rounded
      ${props?.className?.match(/ ?mb-\d/) ? "" : "mb-3" }
      ${props.className || ""}
    `}>
      <Col sm={6}>
        <NumericInput
          form={props.form}
          validations={props.validations}
          className="mb-0"
          path={"parameters.Page"}
          label={"Page"}
          placeholder={"Type the page number of the results that this action shoul try to retrieve"}
          help_text={"The page number of the results that this action shoul try to retrieve."}
        ></NumericInput>
      </Col>
      <Col sm={6}>
        <NumericInput
          form={props.form}
          validations={props.validations}
          className="mb-0"
          path={"parameters.PerPage"}
          label={"Results per page"}
          placeholder={"Type the number of results this action should try to retrieve"}
          help_text={"The number of results this action should try to retrieve."}
        ></NumericInput>
      </Col>
    </Row>
  );
}
