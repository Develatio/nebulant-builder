import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Nav from "react-bootstrap/esm/Nav";
import Tab from "react-bootstrap/esm/Tab";
import Container from "react-bootstrap/esm/Container";
import { WBody } from "@src/ui/structure/WModal/WBody";
import { WHeader } from "@src/ui/structure/WModal/WHeader";
import { WFooter } from "@src/ui/structure/WModal/WFooter";

import { TextInput } from "@src/ui/functionality/TextInput";
import { HCheckboxInput } from "@src/ui/functionality/CheckboxInput";
import { OutputVariable } from "@src/ui/structure/NodeSettings/widgets/OutputVariable";
import { ArrayOfWidgets, WidgetRow } from "@src/ui/structure/NodeSettings/components/ArrayOfWidgets";

import { SettingsStructureValidator } from "@src/components/implementations/base/validators/SettingsStructureValidator";

export const DefineVariablesSettings = (props) => {
  const ssv = new SettingsStructureValidator({
    dont_randomize_output_name: true,
  });

  const vars = props.form.get("parameters.vars");
  const files = props.form.get("parameters.files");

  if(!props.form.getInitialValue("outputs")) {
    let outputs = {};
    vars.filter(v => v).forEach(({ _name, value }) => {
      outputs[value.name] = {
        value: value.name,
        type: "generic:user_variable",
      }
    });

    // Pass data to base validator
    ({ outputs } = ssv.getDefaultValues({ outputs }));

    // By using a setTimeout we avoid updating the form, which belongs to the
    // parent component, while we're rendering this component. If we don't do
    // this, we'll end up in an infinite loop caused by setState calling itself.
    setTimeout(() => {
      props.form.setInitialValue("outputs", outputs);
    });
  }

  return (
    <Container>
      <WHeader help={props.help}>Define blueprint variables</WHeader>

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
                    help_text="Create variables"
                    add_new_text="Add new variable"
                    choices={[
                      {
                        label: "New variable",
                        name: "new-variable",
                        value: {
                          name: "",
                          type: "text",
                          value: "",
                          required: false,
                          ask_at_runtime: false,
                          stack: false,
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
                                <OutputVariable
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.vars[${index}].value.name`}
                                  label={"Name"}
                                  placeholder={"Type a variable name"}
                                  help_text={"The name of the variable."}
                                ></OutputVariable>
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
                                  placeholder={"Type the value of the variable"}
                                  help_text={"The value of the variable."}
                                ></TextInput>
                              </Col>

                              <Col sm={4}>
                                <HCheckboxInput
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.vars[${index}].value.stack`}
                                  className="mb-0"
                                  label={"Stack"}
                                  help_text={"Stack"}
                                ></HCheckboxInput>
                              </Col>

                              <Col sm={4}>
                                <HCheckboxInput
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.vars[${index}].value.ask_at_runtime`}
                                  className="mb-0"
                                  label={"Ask at runtime"}
                                  help_text={"If a value isn't provided, ask the user for one at runtime"}
                                ></HCheckboxInput>
                              </Col>

                              <Col sm={4}>
                                <HCheckboxInput
                                  form={props.form}
                                  className="mb-0"
                                  validations={props.validations}
                                  path={`parameters.vars[${index}].value.required`}
                                  label={"Required"}
                                  help_text={"The user must provide a value for this input parameter."}
                                ></HCheckboxInput>
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
                                  help_text={"Type an absolute or relative path to a dotenv file"}
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
          let outputs = {};

          vars.filter(v => v).forEach(({ _name, value }) => {
            outputs[value.name] = {
              value: value.name,
              type: "generic:user_variable",
            };
          });

          // Pass data to base validator
          ({ outputs } = ssv.getDefaultValues({ outputs }));

          props.form.set("outputs", outputs);
          props.callbacks.save(force, false);
        }}
        validations={props.validations}
      ></WFooter>
    </Container>
  )
}
