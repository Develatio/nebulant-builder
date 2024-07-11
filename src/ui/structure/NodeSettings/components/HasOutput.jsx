import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Alert from "react-bootstrap/esm/Alert";
import FormGroup from "react-bootstrap/esm/FormGroup";
import FormLabel from "react-bootstrap/esm/FormLabel";

export const HasOutput = (props) => {
  return (
    <FormGroup className="form-group" as={Row}>
      <Col sm={12}>
        <hr />
      </Col>

      <Col sm={6}>
        {props.children}
      </Col>

      <Col sm={6} className="d-flex flex-column">
        <FormLabel>{"\u00A0"}</FormLabel>
        <Alert variant="info small py-1">
          This action generates an output value. You can use it in other nodes
          by referencing it's name inside double curly braces. For example:
          <code className="text-nowrap">{"{{"} OUTPUT_VARIABLE {"}}"}</code> or {" "}
          <code className="text-nowrap">{"{{"} OUTPUT_VARIABLE.nested.json.path {"}}"}</code>.
          <br />
          <a
            href="https://goessner.net/articles/JsonPath/index.html"
            target="_blank"
            rel="noopener noreferrer"
          >JSONPath expressions</a> are fully supported.
        </Alert>
      </Col>
    </FormGroup>
  );
}
