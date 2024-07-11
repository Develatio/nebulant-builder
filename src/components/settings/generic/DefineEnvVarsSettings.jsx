import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Nav from "react-bootstrap/esm/Nav";
import Tab from "react-bootstrap/esm/Tab";
import Container from "react-bootstrap/esm/Container";
import { WBody } from "@src/ui/structure/WModal/WBody";
import { WHeader } from "@src/ui/structure/WModal/WHeader";
import { WFooter } from "@src/ui/structure/WModal/WFooter";

import { TextInput } from "@src/ui/functionality/TextInput";
import { ArrayOfWidgets, WidgetRow } from "@src/ui/structure/NodeSettings/components/ArrayOfWidgets";

export const DefineEnvVarsSettings = (props) => {
  const vars = props.form.get("parameters.vars");
  const files = props.form.get("parameters.files");

  return (
    <Container>
      <WHeader help={props.help}>Define environment variables</WHeader>

      <WBody>
        <Tab.Container defaultActiveKey="manually">

          <Row className="mt-3">
            <Col sm={12}>
              <Nav variant="pills d-flex justify-content-center align-items-center stylish-tabs">
                <div className="tabsWrapper d-flex">
                  <Nav.Link eventKey="manually">Manually</Nav.Link>
                  <Nav.Link eventKey="file">From file</Nav.Link>
                </div>
              </Nav>
            </Col>
          </Row>

          <Tab.Content className="pt-3 border-0">
            <Tab.Pane eventKey="manually">
              <Row className="my-3">
                <Col sm={12}>

                  <ArrayOfWidgets
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.vars"}
                    label="Variables"
                    help_text="Define environment variables"
                    add_new_text="Add new environment variable"
                    choices={[
                      {
                        label: "New environment variable",
                        name: "new-environment-variable",
                        value: {
                          name: "",
                          value: "",
                        },
                        multiple: true,
                      },
                    ]}
                  >

                    {
                      vars.map((variable, index) => {
                        return (
                          <WidgetRow
                            key={variable.__uniq}
                            index={index}
                            itemSize={12}
                            form={props.form}
                            path={"parameters.vars"}
                          >
                            <Row key={index}>
                              <Col sm={4}>
                                <TextInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.vars[${index}].value.name`}
                                  label={"Name"}
                                  placeholder={"Type an environment variable name"}
                                  help_text={"The name of the environment variable."}
                                ></TextInput>
                              </Col>
                              <Col sm={8}>
                                <TextInput
                                  as="textarea"
                                  rows="1"
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.vars[${index}].value.value`}
                                  label={"Value"}
                                  placeholder={"Type the value of the environment variable"}
                                  help_text={"The value of the environment variable."}
                                ></TextInput>
                              </Col>
                            </Row>
                          </WidgetRow>
                        )
                      })
                    }

                  </ArrayOfWidgets>

                </Col>
              </Row>
            </Tab.Pane>

            <Tab.Pane eventKey="file">
              <Row className="my-3">
                <Col sm={12}>

                  <ArrayOfWidgets
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.files"}
                    label="File paths"
                    help_text="Add file paths"
                    add_new_text="Add new file path"
                    choices={[
                      {
                        label: "New file path",
                        name: "new-file-path",
                        value: "",
                        multiple: true,
                      },
                    ]}
                  >

                    {
                      files.map((variable, index) => {
                        return (
                          <WidgetRow
                            key={variable.__uniq}
                            index={index}
                            itemSize={12}
                            form={props.form}
                            path={"parameters.files"}
                          >
                            <Row key={index}>
                              <Col sm={12}>
                                <TextInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.files[${index}].value`}
                                  label={"Path"}
                                  placeholder={"/home/user/project/.env"}
                                  help_text={"Type a absolute or relative path to a dotenv file"}
                                ></TextInput>
                              </Col>
                            </Row>
                          </WidgetRow>
                        )
                      })
                    }

                  </ArrayOfWidgets>
                </Col>
              </Row>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </WBody>

      <WFooter
        close={() => props.callbacks.close()}
        save={(force) => {
          props.callbacks.save(force);
        }}
        validations={props.validations}
      ></WFooter>
    </Container>
  )
}
