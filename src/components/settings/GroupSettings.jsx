import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Container from "react-bootstrap/esm/Container";
import FormGroup from "react-bootstrap/esm/FormGroup";
import FormLabel from "react-bootstrap/esm/FormLabel";

import { DiagramQL } from "@src/data/DiagramQL";

import { WBody } from "@src/ui/structure/WModal/WBody";
import { WHeader } from "@src/ui/structure/WModal/WHeader";
import { WFooter } from "@src/ui/structure/WModal/WFooter";

import { TextInput } from "@src/ui/functionality/TextInput";
import { CodeEditor } from "@src/ui/functionality/CodeEditor";
import { CheckboxInput } from "@src/ui/functionality/CheckboxInput";
import { DropdownInput } from "@src/ui/functionality/DropdownInput";
import { VariablesTags } from "@src/ui/functionality/Dropdown/Notifications/VariablesTags";

import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";

export const GroupSettings = (props) => {
  const dql = new DiagramQL();
  const start = props.node.getStartNode();
  const groupName = start.prop("data/settings/parameters/name");
  const input_parameters = props.form.get("parameters.input_parameters");

  const groupVersion = start.prop("data/settings/parameters/version");

  return (
    <Container className="group-settings">
      <WHeader help={props.help}>Group settings</WHeader>

      <WBody>
        <div className="settings-title d-flex justify-content-center align-items-center mt-2 mb-4">
          <span className="lead">Input values for group "{groupName} - {groupVersion}"</span>
        </div>

        {
          input_parameters.map((_variable, index) => {
            return (
              <Row key={index}>
                <Col sm={3}>
                  <FormGroup>
                    <div className="d-flex flex-column">
                      <FormLabel className="mb-0 mt-2">{props.form.get(`parameters.input_parameters[${index}].value.name`)}</FormLabel>
                    </div>
                  </FormGroup>
                </Col>

                <Col sm={9}>
                  {
                    props.form.get(`parameters.input_parameters[${index}].value.type`) == "boolean" ? (
                      <CheckboxInput
                        form={props.form}
                        validations={props.validations}
                        path={`parameters.input_parameters[${index}].value.value`}
                        label={""}
                        help_text={""}
                      ></CheckboxInput>
                    ) : props.form.get(`parameters.input_parameters[${index}].value.type`) == "text" ? (
                      <TextInput
                        node={props.node}
                        form={props.form}
                        validations={props.validations}
                        path={`parameters.input_parameters[${index}].value.value`}
                        placeholder={"Type a value for this input variable"}
                        help_text={"The value of the input variable."}
                      ></TextInput>
                    ) : props.form.get(`parameters.input_parameters[${index}].value.type`) == "textarea" ? (
                      <CodeEditor
                        node={props.node}
                        form={props.form}
                        path={`parameters.input_parameters[${index}].value.value`}
                        label={""}
                        highlight={code => (
                          code.split("\n").map((line, i) => (
                            `<span class='editorLineNumber'>${i + 1}</span>${line}`
                          )).join("\n")
                        )}
                        placeholder={"Type a value for this input variable"}
                      />
                    ) : props.form.get(`parameters.input_parameters[${index}].value.type`) == "selectable-dql-var-type" ? (
                      <DropdownInput
                        node={props.node}
                        form={props.form}
                        validations={props.validations}
                        path={`parameters.input_parameters[${index}].value.value`}
                        help_text={"Select a value."}
                        editable={false}
                        multi={false}
                        options={[
                          ({ searchPattern, page, perPage, group, pagingDetails }) => {
                            const types = props.form.get(`parameters.input_parameters[${index}].value.vartypes`);
                            const options = dql.query(
                              dql.vars_for_dropdown({ node: props.node, type: types })
                            );

                            return new StaticAutocompleter({
                              data: options,
                              filters: { searchPattern, page, perPage, group, pagingDetails },
                            }).run();
                          },
                        ]}
                        notifications={
                          <VariablesTags expected_vars_filter={
                            props.form.get(`parameters.input_parameters[${index}].value.vartypes`).map(t => ({
                              type: t,
                            }))
                          } />
                        }
                      ></DropdownInput>
                    ) : props.form.get(`parameters.input_parameters[${index}].value.type`) == "selectable-dql-var-capability" ? (
                      <DropdownInput
                        node={props.node}
                        form={props.form}
                        validations={props.validations}
                        path={`parameters.input_parameters[${index}].value.value`}
                        help_text={"Select a value."}
                        editable={false}
                        multi={false}
                        options={[
                          ({ searchPattern, page, perPage, group, pagingDetails }) => {
                            const capabilities = props.form.get(`parameters.input_parameters[${index}].value.varcapabilities`);
                            const options = dql.query(
                              dql.vars_for_dropdown({ node: props.node, capability: capabilities })
                            );

                            return new StaticAutocompleter({
                              data: options,
                              filters: { searchPattern, page, perPage, group, pagingDetails },
                            }).run();
                          },
                        ]}
                        notifications={
                          <VariablesTags expected_vars_filter={
                            props.form.get(`parameters.input_parameters[${index}].value.varcapabilities`).map(t => ({
                              capability: t,
                            }))
                          } />
                        }
                      ></DropdownInput>
                    ) : ""
                  }
                </Col>
              </Row>
            )
          })
        }
      </WBody>

      <WFooter
        close={() => props.callbacks.close()}
        save={(force) => {
          props.callbacks.save(force, false);
        }}
        validations={props.validations}
      ></WFooter>
    </Container>
  )
}
