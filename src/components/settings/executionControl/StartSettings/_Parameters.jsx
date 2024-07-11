import { useState, useEffect } from "react";

import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { TextInput } from "@src/ui/functionality/TextInput";
import { DualTextInput } from "@src/ui/functionality/DualTextInput";
import { DropdownInput } from "@src/ui/functionality/DropdownInput";
import { SimpleDropdownInput } from "@src/ui/functionality/SimpleDropdownInput";
import { CheckboxInput, HCheckboxInput } from "@src/ui/functionality/CheckboxInput";
import { OutputVariable } from "@src/ui/structure/NodeSettings/widgets/OutputVariable";
import { ArrayOfWidgets, WidgetRow } from "@src/ui/structure/NodeSettings/components/ArrayOfWidgets";

import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";

export const Parameters = (props) => {
  const [providers, setProviders] = useState([]);
  const [types, setTypes] = useState([]);
  const [capabilities, setCapabilities] = useState([]);

  useEffect(() => {
    // Get the available dataset of providers, types and capabilities
    import("@src/intellisense/providers_types_capabilities.json").then(m => {
      m.providers[0].selected = true;
      setProviders(m.providers);
      setTypes(m.types);
      setCapabilities(m.capabilities);
    });
  }, []);

  const input_parameters = props.form.get("parameters.input_parameters");

  return (
    <Row className="my-3">
      <Col sm={12}>

        <ArrayOfWidgets
          form={props.form}
          validations={props.validations}
          path={"parameters.input_parameters"}
          label="Input variables"
          help_text="Create input variables"
          add_new_text="Add new input variable"
          choices={[
            {
              label: "New input variable",
              name: "new-input-variable",
              value: {
                name: "",
                type: "text",
                value: "",
                bool_value: false,
                vartypes: [],
                varcapabilities: [],
                options: [],
                required: false,
                ask_at_runtime: false,
                stack: false,
              },
              multiple: true,
            },
          ]}
        >
          {
            input_parameters.map((variable, idx_parameter) => {
              return (
                <WidgetRow
                  key={variable.__uniq}
                  index={idx_parameter}
                  itemSize={12}
                  form={props.form}
                  path={"parameters.input_parameters"}
                >
                  <Row>
                    <Col sm={3}>
                      <OutputVariable
                        node={props.node}
                        form={props.form}
                        validations={props.validations}
                        path={`parameters.input_parameters[${idx_parameter}].value.name`}
                        label={"Name"}
                        placeholder={"Type a name for the input variable"}
                        help_text={"The name of the input variable."}
                      ></OutputVariable>
                    </Col>

                    <Col sm={3}>
                      <SimpleDropdownInput
                        form={props.form}
                        validations={props.validations}
                        path={`parameters.input_parameters[${idx_parameter}].value.type`}
                        label={"Input type"}
                        help_text={"Select the input type"}
                        options={[
                          {
                            type: "value",
                            label: "Toggle",
                            value: "boolean",
                          },
                          {
                            type: "value",
                            label: "Text",
                            value: "text",
                          },
                          {
                            type: "value",
                            label: "Textarea",
                            value: "textarea",
                          },
                          {
                            type: "value",
                            label: "Selectable (blueprint variables by type)",
                            value: "selectable-dql-var-type",
                          },
                          {
                            type: "value",
                            label: "Selectable (blueprint variables by capability)",
                            value: "selectable-dql-var-capability",
                          },
                          {
                            type: "value",
                            label: "Selectable (predefined values)",
                            value: "selectable-static",
                          },
                        ]}
                      ></SimpleDropdownInput>
                    </Col>

                    <Col sm={6}>
                      {
                        props.form.get(`parameters.input_parameters[${idx_parameter}].value.type`) === "boolean" ? (
                          <CheckboxInput
                            form={props.form}
                            validations={props.validations}
                            path={`parameters.input_parameters[${idx_parameter}].value.bool_value`}
                            label={"Default value"}
                            placeholder={"You can assign a default value for this input variable."}
                          ></CheckboxInput>
                        ) : props.form.get(`parameters.input_parameters[${idx_parameter}].value.type`) === "text" ? (
                          <TextInput
                            node={props.node}
                            form={props.form}
                            validations={props.validations}
                            path={`parameters.input_parameters[${idx_parameter}].value.value`}
                            label={"Default value"}
                            placeholder={"The default value for this input variable"}
                            help_text={"You can assign a default value for this input variable."}
                          ></TextInput>
                        ) : props.form.get(`parameters.input_parameters[${idx_parameter}].value.type`) === "textarea" ? (
                          <TextInput
                            as={"textarea"}
                            node={props.node}
                            form={props.form}
                            validations={props.validations}
                            path={`parameters.input_parameters[${idx_parameter}].value.value`}
                            label={"Default value"}
                            placeholder={"You can assign a default value for this input variable."}
                          ></TextInput>
                        ) : props.form.get(`parameters.input_parameters[${idx_parameter}].value.type`) === "selectable-dql-var-type" ? (
                          <DropdownInput
                            node={props.node}
                            form={props.form}
                            validations={props.validations}
                            path={`parameters.input_parameters[${idx_parameter}].value.vartypes`}
                            label={"Selectable variables"}
                            help_text={"Select as many variable types as you want in order to filter what the end user will be able to select"}
                            editable={true}
                            multi={true}
                            groups={providers}
                            groupsDisallowUnselect={true}
                            options={[
                              ({ searchPattern, page, perPage, group, pagingDetails }) => {
                                return new StaticAutocompleter({
                                  data: types.filter(o => o.value.split(":")[0] === group),
                                  filters: { searchPattern, page, perPage, group, pagingDetails },
                                }).run();
                              },
                            ]}
                          ></DropdownInput>
                        ) : props.form.get(`parameters.input_parameters[${idx_parameter}].value.type`) === "selectable-dql-var-capability" ? (
                          <DropdownInput
                            node={props.node}
                            form={props.form}
                            validations={props.validations}
                            path={`parameters.input_parameters[${idx_parameter}].value.varcapabilities`}
                            label={"Selectable variables"}
                            help_text={"Select as many variable capabilities as you want in order to filter what the end user will be able to select"}
                            editable={true}
                            multi={true}
                            options={[
                              ({ searchPattern, page, perPage, group, pagingDetails }) => {
                                return new StaticAutocompleter({
                                  data: capabilities,
                                  filters: { searchPattern, page, perPage, group, pagingDetails },
                                }).run();
                              },
                            ]}
                          ></DropdownInput>
                        ) : props.form.get(`parameters.input_parameters[${idx_parameter}].value.type`) === "selectable-static" ? (
                          <ArrayOfWidgets
                            form={props.form}
                            validations={props.validations}
                            path={`parameters.input_parameters[${idx_parameter}].value.options`}
                            label="Selectable options"
                            help_text="Create selectable options"
                            add_new_text="Add new selectable option"
                            choices={[
                              {
                                label: "New option",
                                name: "new-option",
                                value: ["", ""],
                                multiple: true,
                              },
                            ]}
                          >
                            {
                              props.form.get(`parameters.input_parameters[${idx_parameter}].value.options`).map((value, idx_options) => {
                                return (
                                  <WidgetRow
                                    key={value.__uniq}
                                    index={idx_options}
                                    form={props.form}
                                    itemSize={12}
                                    path={`parameters.input_parameters[${idx_parameter}].value.options`}
                                  >
                                    <DualTextInput
                                      node={props.node}
                                      form={props.form}
                                      validations={props.validations}
                                      path={`parameters.input_parameters[${idx_parameter}].value.options[${idx_options}].value`}
                                      prefix1="Label"
                                      prefix2="Value"
                                      placeholder={"Type a label"}
                                      placeholder2={"Type a value"}
                                      className="mb-0"
                                    ></DualTextInput>
                                  </WidgetRow>
                                )
                              })
                            }
                          </ArrayOfWidgets>
                        ) : ""
                      }
                    </Col>

                    <Col sm={3}>
                      <HCheckboxInput
                        form={props.form}
                        className="mb-0"
                        validations={props.validations}
                        path={`parameters.input_parameters[${idx_parameter}].value.stack`}
                        label={"Stack"}
                        help_text={"Stack"}
                      ></HCheckboxInput>
                    </Col>

                    <Col sm={5}>
                      <HCheckboxInput
                        form={props.form}
                        className="mb-0"
                        validations={props.validations}
                        path={`parameters.input_parameters[${idx_parameter}].value.ask_at_runtime`}
                        label={"Ask at runtime"}
                        help_text={"If a value isn't provided, ask the user for one at runtime"}
                      ></HCheckboxInput>
                    </Col>

                    <Col sm={4}>
                      <HCheckboxInput
                        form={props.form}
                        className="mb-0"
                        validations={props.validations}
                        path={`parameters.input_parameters[${idx_parameter}].value.required`}
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
  );
}
