import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { TextInput } from "@src/ui/functionality/TextInput";
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
          path={"parameters.MaxResults"}
          label={"Max results"}
          placeholder={"Type the number of results this action should try to retrieve"}
          help_text={"The number of results this action should try to retrieve."}
        ></NumericInput>
      </Col>
      <Col sm={6}>
        <TextInput
          form={props.form}
          validations={props.validations}
          className="mb-0"
          path={"parameters.NextToken"}
          label={"Next token"}
          placeholder={"Type the token for the next page of results"}
          help_text={"The token used to fetch the next page of results"}
        ></TextInput>
      </Col>
    </Row>
  );
}
