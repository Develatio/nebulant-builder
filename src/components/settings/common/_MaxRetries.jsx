import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { NumericInput } from "@src/ui/functionality/NumericInput";

export const MaxRetries = (props) => {
  return (
    <Row className={`
      bg-almost-dark px-2 py-3 border rounded
      ${props.className || ""}
    `}>
      <Col sm={6}>
        <NumericInput
          form={props.form}
          validations={props.validations}
          className="mb-0"
          path={"parameters._maxRetries"}
          label={"Max retries"}
          placeholder={"Type the number of times this action will be retried"}
          help_text={"The number of times this action will be retried in the event of recoverable issues."}
        ></NumericInput>
      </Col>
    </Row>
  );
}
