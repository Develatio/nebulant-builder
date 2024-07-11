import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import FormCheck from "react-bootstrap/esm/FormCheck";

const NotToggle = ({ className, handleOnChange, checked }) => (
  <Row className={`form-check-inline ${className}`}>
    <Col sm={12}>
      <FormCheck
        id={`checkbox-${Math.random()}`}
        className="form-check-input w-100"
        type="switch"
        onChange={(e) => handleOnChange(e.target.checked)}
        checked={!!checked}
      >
        <FormCheck.Input type="checkbox" />
        <FormCheck.Label className="text-nowrap">Invert this condition</FormCheck.Label>
      </FormCheck>
    </Col>
  </Row>
);

NotToggle.displayName = "NotToggle";

export {
  NotToggle,
};
