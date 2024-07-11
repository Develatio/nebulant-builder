import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Modal from "react-bootstrap/esm/Modal";
import Button from "react-bootstrap/esm/Button";

export const WFooter = (props) => {
  return (
    <Modal.Footer className="mx-4 px-0">
      <Row className="w-100">
        <Col sm={12} className="d-flex justify-content-between px-0">
          {
            props.close ? (
              <Button variant="secondary" onClick={() => props.close()}>Close</Button>
            ) : ""
          }

          {props.children}

          {
            props.save ? (
              //
              props.validations.submitted && !props.validations.isValid ? (
                <Button
                  variant="warning"
                  onClick={() => props.save(true)}
                >Ignore validation errors and save</Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => props.save()}
                >Save</Button>
              )
            ) : ""
          }
        </Col>
      </Row>
    </Modal.Footer>
  );
}
