import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Tab from "react-bootstrap/esm/Tab";
import Nav from "react-bootstrap/esm/Nav";

import { Runtime } from "@src/core/Runtime";
import { BaseDiagramModel } from "@src/models/BaseDiagramModel";
import { Intellisense } from "@src/intellisense/base/Intellisense";

import "@src/App.scss";

import { SuperSelectTab } from "./SuperSelectTab";
import { SuperTextTab } from "./SuperTextTab";

export const Playground = () => {
  const runtime = new Runtime();
  runtime.set("object.BaseDiagramModel", BaseDiagramModel);

  return (
    <div className="application">
      <div className="application-main d-flex">
        <Intellisense />

        <div className="w-100">
          <Row className="px-3">
            <Col sm={12}>
              <Tab.Container defaultActiveKey="superselect">

                <Row className="my-3">
                  <Col sm={12}>
                    <Nav variant="pills d-flex justify-content-center align-items-center stylish-tabs">
                      <div className="tabsWrapper d-flex">
                        <Nav.Link eventKey="superselect">SuperSelect</Nav.Link>
                        <Nav.Link eventKey="supertext">SuperText</Nav.Link>
                      </div>
                    </Nav>
                  </Col>
                </Row>

                <Tab.Content className="pt-3 border-0">
                  <Tab.Pane eventKey="superselect">
                    <SuperSelectTab />
                  </Tab.Pane>

                  <Tab.Pane eventKey="supertext">
                    <SuperTextTab />
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}
