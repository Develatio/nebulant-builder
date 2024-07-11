import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Form from "react-bootstrap/esm/Form";
import Modal from "react-bootstrap/esm/Modal";
import Container from "react-bootstrap/esm/Container";

export const WBody = (props) => {
  const scrollable = props.scrollable ?? true;

  return (
    <Modal.Body className={scrollable ? "scroll" : ""}>
      <Container className="px-2">
        <Row>
          <Col>
            <Form noValidate>
              {
                // https://stackoverflow.com/a/51507806
                // Prevent implicit submission of the form
              }
              <button type="submit" disabled className="d-none" aria-hidden="true"></button>

              { props.children }
            </Form>
          </Col>
        </Row>
      </Container>
    </Modal.Body>
  );
}
