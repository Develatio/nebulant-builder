import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Nav from "react-bootstrap/esm/Nav";
import Tab from "react-bootstrap/esm/Tab";
import Alert from "react-bootstrap/esm/Alert";
import Container from "react-bootstrap/esm/Container";
import FormLabel from "react-bootstrap/esm/FormLabel";

import { DiagramQL } from "@src/data/DiagramQL";

import { WBody } from "@src/ui/structure/WModal/WBody";
import { WHeader } from "@src/ui/structure/WModal/WHeader";
import { WFooter } from "@src/ui/structure/WModal/WFooter";
import { HasOutput } from "@src/ui/structure/NodeSettings/components/HasOutput";
import { AdvancedSettings } from "@src/ui/structure/NodeSettings/components/AdvancedSettings";

import { Paging } from "@src/components/settings/hetznerCloud/_Paging";
import { MaxRetries } from "@src/components/settings/common/_MaxRetries";

import { Tooltip } from "@src/ui/functionality/Tooltip";
import { TextInput } from "@src/ui/functionality/TextInput";
import { DropdownInput } from "@src/ui/functionality/DropdownInput";
import { OutputVariable } from "@src/ui/structure/NodeSettings/widgets/OutputVariable";
import { VariablesTags } from "@src/ui/functionality/Dropdown/Notifications/VariablesTags";
import { CliConnectivity } from "@src/ui/functionality/Dropdown/Notifications/CliConnectivity";
import { ArrayOfWidgets, WidgetRow } from "@src/ui/structure/NodeSettings/components/ArrayOfWidgets";

import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";
import { FloatingIPAutocompleter } from "@src/components/autocompleters/hetznerCloud/FloatingIPAutocompleter";

import { useOneShotState } from "@src/utils/react/useOneShotState";

import { LabelSelectorTooltip } from "@src/components/settings/hetznerCloud/_LabelSelectorTooltip";

const floating_ip_filters = { type: "hetznerCloud:floating_ip" };

export const FindFloatingIPSettings = (props) => {
  const dql = new DiagramQL();

  const dqlResults = useOneShotState(() => ({
    floating_ips: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...floating_ip_filters })
    ),
  }));

  return (
    <Container>
      <WHeader help={props.help}>Hetzner Cloud - Find floating IP</WHeader>

      <WBody>
        <Tab.Container defaultActiveKey="filters" activeKey={props.form.get("parameters._activeTab")}>
          <Row className="mt-3">
            <Col sm={12}>
              <Nav variant="pills d-flex justify-content-center align-items-center stylish-tabs">
                <div className="tabsWrapper d-flex">
                  <Nav.Link onClick={() => props.form.set("parameters._activeTab", "filters")} eventKey="filters">Find using filters</Nav.Link>
                  {
                    props.node.prop("data/id") === "find-floating-ip" ? (
                      <Nav.Link onClick={() => props.form.set("parameters._activeTab", "id")} eventKey="id">Find by ID</Nav.Link>
                    ) : ""
                  }
                </div>
              </Nav>
            </Col>
          </Row>

          <Tab.Content className="pt-3 border-0">
            <Tab.Pane eventKey="filters">
              <Row className="my-3">
                <Col sm={6}>
                  <TextInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.Name"}
                    label={"Name"}
                    placeholder={"Type a name"}
                    help_text={"The name that will be used to filter the floating IP."}
                  ></TextInput>
                </Col>

                <Col sm={6} className="d-flex flex-column">
                  <FormLabel>{"\u00A0"}</FormLabel>
                  <Alert variant="info" className="py-1 small">
                    Keep in mind that Hetzner's filtering is case sensitive.
                    It also matches only against whole words.
                  </Alert>
                </Col>

                <Col sm={12}>
                  <ArrayOfWidgets
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.Filters"}
                    label="Additional filters"
                    help_text="Narrow down the search further by applying more filters. Logical operator AND will be used if more than one filter is selected. If more than one value for each filter is selected, logical operator OR will be applied between each value (where applicable)."
                    choices={[
                      {
                        label: "Label",
                        name: "LabelSelector",
                        value: "",
                      },
                    ]}
                  >
                    {
                      props.form.get("parameters.Filters").map((value, index) => {
                        return (
                          <WidgetRow
                            key={value.__uniq}
                            index={index}
                            form={props.form}
                            path={"parameters.Filters"}
                          >
                            {
                              value.name == "LabelSelector" ? (
                                <TextInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Label filter"}
                                  placeholder={"Type a label filter expression"}
                                  help_text={
                                    <>
                                      A
                                      <Tooltip
                                        maxWidth={450}
                                        placement="right"
                                        label={<LabelSelectorTooltip />}
                                      >
                                        <span className="text-decoration-underline mx-1">label filter expression</span>
                                      </Tooltip>
                                      that will be used to perform the filtering.
                                    </>
                                  }
                                ></TextInput>
                              ) : ""
                            }
                          </WidgetRow>
                        )
                      })
                    }
                  </ArrayOfWidgets>
                </Col>
              </Row>
            </Tab.Pane>

            <Tab.Pane eventKey="id">
              <Row className="my-3">
                <Col sm={12}>
                  <DropdownInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.ids"}
                    label={"Floating IP ID"}
                    help_text={"Filter by specific ID."}
                    editable={true}
                    multi={false}
                    options={[
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new StaticAutocompleter({
                          data: dqlResults.floating_ips,
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run();
                      },
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new FloatingIPAutocompleter({
                          node: props.node,
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run({ id: `${props.node.id}-parameters.ids` });
                      },
                    ]}
                    notifications={
                      <>
                        <VariablesTags expected_vars_filter={[
                          floating_ip_filters,
                        ]} />
                        <CliConnectivity />
                      </>
                    }
                  ></DropdownInput>
                </Col>
              </Row>
            </Tab.Pane>
          </Tab.Content>

        </Tab.Container>

        <AdvancedSettings>
          {
            props.node.prop("data/id") === "find-floating-ips" ? (
              <Paging {...props} />
            ) : ""
          }
          <MaxRetries {...props} />
        </AdvancedSettings>

        <HasOutput>
          <OutputVariable
            form={props.form}
            validations={props.validations}
            path={"outputs.result.value"}
            label={"Output variable"}
          ></OutputVariable>
        </HasOutput>
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
