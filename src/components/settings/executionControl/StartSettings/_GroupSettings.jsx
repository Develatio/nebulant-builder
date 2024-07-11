import Tab from "react-bootstrap/esm/Tab";
import Nav from "react-bootstrap/esm/Nav";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { Heading } from "@src/ui/visual/Heading";

import { WBody } from "@src/ui/structure/WModal/WBody";

import { TextInput } from "@src/ui/functionality/TextInput";
import { ColorPicker } from "@src/ui/functionality/ColorPicker";
import { ImagePicker } from "@src/ui/functionality/ImagePicker";
import { CheckboxInput } from "@src/ui/functionality/CheckboxInput";

import { Parameters } from "./_Parameters";
import { GroupPreview } from "./_GroupPreview";

export const GroupSettings = (props) => {
  const { node, form } = props;

  return (
    <WBody>
      <Tab.Container defaultActiveKey="general">

        <Row className="mt-3">
          <Col sm={12}>
            <Nav variant="pills d-flex justify-content-center align-items-center stylish-tabs">
              <div className="tabsWrapper d-flex">
                <Nav.Link eventKey="general">General</Nav.Link>
                {
                  form.get("parameters.group_settings_enabled") && (
                    <Nav.Link eventKey="parameters">Parameters</Nav.Link>
                  )
                }
                {/*<Nav.Link eventKey="output">Output</Nav.Link>*/}
              </div>
            </Nav>
          </Col>
        </Row>

        <Tab.Content className="pt-3 border-0">
          <Tab.Pane eventKey="general">
            <Row>
              <Col sm={6}>
                <Row>
                  <Col sm={12}>
                    <TextInput
                      node={node}
                      form={form}
                      validations={props.validations}
                      label={"Name"}
                      path={"parameters.name"}
                      placeholder={"Type the name of the blueprint"}
                    ></TextInput>
                  </Col>

                  <Col sm={6}>
                    {
                      // Only groups have versions. The main "Start" node is
                      // always at the "draft" version
                      node.parent() ? (
                        <TextInput
                          node={node}
                          form={form}
                          validations={props.validations}
                          label={"Version"}
                          path={"parameters.version"}
                          placeholder={"Type the version of the group"}
                        ></TextInput>
                      ) : (
                        <TextInput
                          node={node}
                          form={form}
                          validations={props.validations}
                          label={"Version"}
                          value={node.prop("data/settings/parameters/version")}
                          disabled
                        ></TextInput>
                      )
                    }
                  </Col>
                </Row>
              </Col>
              <Col sm={6}>
                <TextInput
                  as="textarea"
                  node={node}
                  form={form}
                  rows={5}
                  validations={props.validations}
                  label={"Description"}
                  path={"parameters.description"}
                  placeholder={"Type a short description of what this blueprint does"}
                ></TextInput>
              </Col>

              {
                !node.parent() && (
                  <>
                    <Col sm={6} className="mt-4">
                      <CheckboxInput
                        form={form}
                        validations={props.validations}
                        path={"parameters.group_settings_enabled"}
                        label={"Importable as group"}
                        help_text={"Make this blueprint importable into other blueprints."}
                      ></CheckboxInput>
                    </Col>
                    <Col sm={6} className="mt-4 d-flex align-items-end">
                      <div className="callout callout-info py-2">
                        {
                          form.get("parameters.group_settings_enabled") ? (
                            "The 'End' action will be removed from the blueprint if you disable this."
                          ) : (
                            "An 'End' action will be added right next to the 'Start' action if you enable this."
                          )
                        }
                      </div>
                    </Col>
                  </>
                )
              }
            </Row>

            {
              form.get("parameters.group_settings_enabled") && (
                <>
                  <Row className="mt-4">
                    <Col sm={12}>
                      <Heading>Group appearance</Heading>
                    </Col>
                  </Row>

                  <Row>
                    <Col sm={4}>
                      <Row>
                        <Col sm={12}>
                          <ImagePicker
                            node={node}
                            form={form}
                            validations={props.validations}
                            label={"Group image"}
                            path={"parameters.image"}
                          ></ImagePicker>
                        </Col>
                      </Row>
                    </Col>

                    <Col sm={4}>
                      <Row>
                        <Col sm={12}>
                          <GroupPreview
                            name={form.get("parameters.name")}
                            color={form.get("parameters.color")}
                            text_color={form.get("parameters.text_color")}
                            image={form.get("parameters.image")}
                          />
                        </Col>
                      </Row>
                    </Col>

                    <Col sm={4}>
                      <Row>
                        <Col sm={12}>
                          <ColorPicker
                            node={node}
                            form={form}
                            validations={props.validations}
                            label={"Text color"}
                            path={"parameters.text_color"}
                            placeholder={""}
                          ></ColorPicker>
                        </Col>

                        <Col sm={12}>
                          <ColorPicker
                            node={node}
                            form={form}
                            validations={props.validations}
                            label={"Background color"}
                            path={"parameters.color"}
                            placeholder={""}
                          ></ColorPicker>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </>
              )
            }
          </Tab.Pane>

          <Tab.Pane eventKey="parameters">
            <Parameters form={form} validations={props.validations} />
          </Tab.Pane>
        </Tab.Content>

      </Tab.Container>
    </WBody>
  );
}
