import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Modal from "react-bootstrap/esm/Modal";

export const WHeader = (props) => {
  return (
    <Modal.Header closeButton className="mx-4 px-0">
      <Row className="w-100">
        <Col sm={12} className="d-flex justify-content-between align-items-center">
          <Modal.Title>{props.children}</Modal.Title>

          {
            props.help ? props.help : ""
          }
        </Col>
      </Row>
    </Modal.Header>
  );
}
