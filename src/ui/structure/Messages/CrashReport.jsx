import Card from "react-bootstrap/esm/Card";
import Accordion from "react-bootstrap/esm/Accordion";

export const CrashReport = (props) => {
  return (
    <>
      <div className="callout callout-danger">
        <h5>An unexpected error ocurred!</h5>
        { props.error || "Please check the log viewer for more information." }
      </div>

      <div className="callout callout-default">
        <h6>Can you help us?</h6>
        Creating a GitHub issue with the data of this crash report will
        help us debug and fix the problem. We have scrubbed the data trying to
        remove any personal / private data, but you'll have the chance to modify
        the crash report once redirected to our GitHub repository.
      </div>

      <Accordion>
        <Card>
          <Accordion.Item eventKey="0" className="border-0">
            <Card.Header className="p-1 border-0">
              <Accordion.Button className="p-1 pointer accordion-btn">
                We'll send the following data:
              </Accordion.Button>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <pre>{ props.data }</pre>
              </Card.Body>
            </Accordion.Collapse>
          </Accordion.Item>
        </Card>
      </Accordion>
    </>
  )
}
