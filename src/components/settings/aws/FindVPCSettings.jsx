import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Nav from "react-bootstrap/esm/Nav";
import Tab from "react-bootstrap/esm/Tab";
import Container from "react-bootstrap/esm/Container";

import { DiagramQL } from "@src/data/DiagramQL";

import { WBody } from "@src/ui/structure/WModal/WBody";
import { WHeader } from "@src/ui/structure/WModal/WHeader";
import { WFooter } from "@src/ui/structure/WModal/WFooter";
import { Paging } from "@src/components/settings/aws/_Paging";
import { MaxRetries } from "@src/components/settings/common/_MaxRetries";
import { HasOutput } from "@src/ui/structure/NodeSettings/components/HasOutput";
import { AdvancedSettings } from "@src/ui/structure/NodeSettings/components/AdvancedSettings";
import { ArrayOfWidgets, WidgetRow } from "@src/ui/structure/NodeSettings/components/ArrayOfWidgets";

import { TextInput } from "@src/ui/functionality/TextInput";
import { DualTextInput } from "@src/ui/functionality/DualTextInput";
import { CheckboxInput } from "@src/ui/functionality/CheckboxInput";
import { DropdownInput } from "@src/ui/functionality/DropdownInput";
import { MultiTextInput } from "@src/ui/functionality/MultiTextInput";
import { OutputVariable } from "@src/ui/structure/NodeSettings/widgets/OutputVariable";
import { VariablesTags } from "@src/ui/functionality/Dropdown/Notifications/VariablesTags";
import { CliConnectivity } from "@src/ui/functionality/Dropdown/Notifications/CliConnectivity";

import { VPCAutocompleter } from "@src/components/autocompleters/aws/VPCAutocompleter";
import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";
import { RegionsAutocompleter } from "@src/components/autocompleters/aws/RegionsAutocompleter";

import { useOneShotState } from "@src/utils/react/useOneShotState";
import { usePromiseValue } from "@src/utils/react/usePromiseValue";

import { VPC_STATES } from "./_vpc_states";
import { IPV4_CIDR_STATES } from "./_ipv4_cidr_states";
import { IPV6_CIDR_STATES } from "./_ipv6_cidr_states";

const vpcs_filters = { type: "aws:vpc" };

export const FindVPCSettings = (props) => {
  const dql = new DiagramQL();

  const regions = usePromiseValue((new RegionsAutocompleter({
    node: props.node,
    filters: { perPage: Infinity },
  })).run(), {});

  const dqlResults = useOneShotState(() => ({
    vpcs: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...vpcs_filters })
    ),
  }));

  return (
    <Container>
      <WHeader help={props.help}>AWS - Find VPC</WHeader>

      <WBody>
        <Tab.Container defaultActiveKey="filters" activeKey={props.form.get("parameters._activeTab")}>

          <Row className="mt-3">
            <Col sm={12}>
              <Nav variant="pills d-flex justify-content-center align-items-center stylish-tabs">
                <div className="tabsWrapper d-flex">
                  <Nav.Link onClick={() => props.form.set("parameters._activeTab", "filters")} eventKey="filters">Find using filters</Nav.Link>
                  {
                    props.node.prop("data/id") === "find-vpc" ? (
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
                    path={"parameters._VPCName"}
                    label={"Name"}
                    placeholder={"Type a name"}
                    help_text={"The name that will be used to filter VPCs."}
                  ></TextInput>
                </Col>

                <Col sm={12}>
                  <ArrayOfWidgets
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.Filters"}
                    label="Filters"
                    help_text="Narrow down the search further by applying filters. Logical operator AND will be used if more than one filter is selected. If more than one value for each filter is selected, logical operator OR will be applied between each value (where applicable)."
                    choices={[
                      {
                        label: "CIDR",
                        name: "cidr",
                        value: "",
                      },
                      {
                        label: "Associated CIDR block",
                        name: "cidr-block-association.cidr-block",
                        value: "",
                      },

                      // cidr-block-association.association-id - The association ID for an IPv4 CIDR block associated with the VPC

                      {
                        label: "Associated CIDR state",
                        name: "cidr-block-association.state",
                        value: [],
                      },

                      // dhcp-options-id - The ID of a set of DHCP options

                      {
                        label: "Associated IPv6 CIDR block",
                        name: "ipv6-cidr-block-association.ipv6-cidr-block",
                        value: "",
                      },

                      // ipv6-cidr-block-association.ipv6-pool - The ID of the IPv6 address pool from which the IPv6 CIDR block is allocated
                      // ipv6-cidr-block-association.association-id - The association ID for an IPv6 CIDR block associated with the VPC

                      {
                        label: "Associated IPv6 CIDR state",
                        name: "ipv6-cidr-block-association.state",
                        value: [],
                      },
                      {
                        label: "Default",
                        name: "isDefault",
                        value: false,
                      },
                      {
                        label: "Owner ID",
                        name: "owner-id",
                        value: "",
                      },
                      {
                        label: "State",
                        name: "state",
                        value: [],
                      },
                      {
                        label: "Tag",
                        name: "tag",
                        value: ["", ""],
                        multiple: true
                      },
                      {
                        label: "Tag key",
                        name: "tag-key",
                        value: [],
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
                              value.name == "cidr" ? (
                                <TextInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"CIDR"}
                                  placeholder={"Type a CIDR"}
                                  help_text={"The CIDR block you specify must exactly match the VPC's CIDR block. Must contain the slash followed by one or two digits (for example, /28)."}
                                ></TextInput>
                              ) : value.name == "cidr-block-association.cidr-block" ? (
                                <TextInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  className="mb-0"
                                  path={`parameters.Filters[${index}].value`}
                                  label={"Associated CIDR block"}
                                  placeholder={"Type a CIDR"}
                                  help_text={"An IPv4 CIDR block associated with the VPC."}
                                ></TextInput>
                              ) : value.name == "cidr-block-association.state" ? (
                                <DropdownInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  className="mb-0"
                                  path={`parameters.Filters[${index}].value`}
                                  label={"Associated CIDR state"}
                                  placeholder={"Select a state"}
                                  help_text={"The state of an IPv4 CIDR block associated with the VPC."}
                                  editable={true}
                                  multi={true}
                                  options={[
                                    ({ searchPattern, page, perPage, group, pagingDetails }) => {
                                      return new StaticAutocompleter({
                                        data: IPV4_CIDR_STATES,
                                        filters: { searchPattern, page, perPage, group, pagingDetails },
                                      }).run();
                                    },
                                  ]}
                                ></DropdownInput>
                              ) : value.name == "ipv6-cidr-block-association.ipv6-cidr-block" ? (
                                <TextInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Associated IPv6 CIDR block"}
                                  placeholder={"Type a CIDR"}
                                  help_text={"An IPv6 CIDR block associated with the VPC."}
                                ></TextInput>
                              ) : value.name == "ipv6-cidr-block-association.state" ? (
                                <DropdownInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Associated IPv6 CIDR state"}
                                  placeholder={"Select a state"}
                                  help_text={"The state of an IPv6 CIDR block associated with the VPC."}
                                  editable={true}
                                  multi={true}
                                  options={[
                                    ({ searchPattern, page, perPage, group, pagingDetails }) => {
                                      return new StaticAutocompleter({
                                        data: IPV6_CIDR_STATES,
                                        filters: { searchPattern, page, perPage, group, pagingDetails },
                                      }).run();
                                    },
                                  ]}
                                ></DropdownInput>
                              ) : value.name == "isDefault" ? (
                                <CheckboxInput
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Default"}
                                  help_text={"Indicates whether the VPC is the default VPC."}
                                ></CheckboxInput>
                              ) : value.name == "owner-id" ? (
                                <TextInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Owner ID"}
                                  placeholder={"Type an owner ID"}
                                  help_text={"The AWS account ID of the owner of the VPC."}
                                ></TextInput>
                              ) : value.name == "state" ? (
                                <DropdownInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"State"}
                                  placeholder={"Select a state"}
                                  help_text={"The state of the VPC."}
                                  editable={true}
                                  multi={true}
                                  options={[
                                    ({ searchPattern, page, perPage, group, pagingDetails }) => {
                                      return new StaticAutocompleter({
                                        data: VPC_STATES,
                                        filters: { searchPattern, page, perPage, group, pagingDetails },
                                      }).run();
                                    },
                                  ]}
                                ></DropdownInput>
                              ) : value.name == "tag" ? (
                                <DualTextInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Tag"}
                                  placeholder={"Type a tag key"}
                                  placeholder2={"Type a tag value"}
                                  help_text1={"Use the tag key as the filter name and the tag value as the filter value."}
                                ></DualTextInput>
                              ) : value.name == "tag-key" ? (
                                <MultiTextInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Tag key"}
                                  placeholder={"Type a key of a tag assigned to the image"}
                                  help_text={"Use this filter to find all VPCs assigned a tag with a specific key, regardless of the tag value."}
                                ></MultiTextInput>
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
                    path={"parameters.VpcIds"}
                    label={"VPC ID"}
                    help_text={"Filter by specific ID."}
                    editable={true}
                    multi={false}
                    groups={regions?.data}
                    groupsDisallowUnselect={true}
                    options={[
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new StaticAutocompleter({
                          data: dqlResults.vpcs,
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run();
                      },
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new VPCAutocompleter({
                          node: props.node,
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run({ id: `${props.node.id}-parameters.VpcIds` });
                      },
                    ]}
                    notifications={
                      <>
                        <VariablesTags expected_vars_filter={[
                          vpcs_filters,
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
            props.node.prop("data/id") === "find-vpcs" ? (
              <Paging {...props} />
            ) : ""
          }
          <MaxRetries className="mb-0" {...props} />
        </AdvancedSettings>

        <HasOutput>
          <OutputVariable
            form={props.form}
            validations={props.validations}
            path={"outputs.result.value"}
            label={"Found Subnet"}
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
