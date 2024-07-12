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

import { SubnetAutocompleter } from "@src/components/autocompleters/aws/SubnetAutocompleter";
import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";
import { RegionsAutocompleter } from "@src/components/autocompleters/aws/RegionsAutocompleter";
import { AvailabilityZonesAutocompleter } from "@src/components/autocompleters/aws/AvailabilityZonesAutocompleter";

import { useOneShotState } from "@src/utils/react/useOneShotState";
import { usePromiseValue } from "@src/utils/react/usePromiseValue";

import { SUBNET_STATES } from "./_subnet_states";
import { IPV6_CIDR_STATES } from "./_ipv6_cidr_states";

const subnets_filters = { type: "aws:subnet" };

export const FindSubnetSettings = (props) => {
  const dql = new DiagramQL();

  const azs = usePromiseValue((new AvailabilityZonesAutocompleter({
    node: props.node,
    filters: { perPage: Infinity },
  })).run(), {});

  const regions = usePromiseValue((new RegionsAutocompleter({
    node: props.node,
    filters: { perPage: Infinity },
  })).run(), {});

  const dqlResults = useOneShotState(() => ({
    subnets: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...subnets_filters })
    ),
  }));

  return (
    <Container>
      <WHeader help={props.help}>AWS - Find Subnet</WHeader>

      <WBody>
        <Tab.Container defaultActiveKey="filters" activeKey={props.form.get("parameters._activeTab")}>

          <Row className="mt-3">
            <Col sm={12}>
              <Nav variant="pills d-flex justify-content-center align-items-center stylish-tabs">
                <div className="tabsWrapper d-flex">
                  <Nav.Link onClick={() => props.form.set("parameters._activeTab", "filters")} eventKey="filters">Find using filters</Nav.Link>
                  {
                    props.node.prop("data/id") === "find-subnet" ? (
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
                    path={"parameters._SubnetName"}
                    label={"Name"}
                    placeholder={"Type a name"}
                    help_text={"The name that will be used to filter subnets."}
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
                        label: "Availability Zone",
                        name: "availability-zone",
                        value: [],
                      },

                      // availability-zone-id - Availability Zone ID
                      // available-ip-address-count - The number of IPv4 addresses in the subnet that are available.

                      {
                        label: "CIDR block",
                        name: "cidr-block",
                        value: "",
                      },
                      {
                        label: "Default for AZ",
                        name: "default-for-az",
                        value: false,
                      },
                      {
                        label: "IPv6 CIDR block",
                        name: "ipv6-cidr-block-association.ipv6-cidr-block",
                        value: "",
                      },

                      // ipv6-cidr-block-association.association-id - An association ID for an IPv6 CIDR block associated with the subnet.

                      {
                        label: "Associated IPv6 CIDR state",
                        name: "ipv6-cidr-block-association.state",
                        value: [],
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
                        label: "Subnet ARN",
                        name: "subnet-arn",
                        value: "",
                      },
                      {
                        label: "Subnet ID",
                        name: "subnet-id",
                        value: "",
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
                      {
                        label: "VPC ID",
                        name: "vpc-id",
                        value: "",
                      }
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
                              value.name == "availability-zone" ? (
                                <DropdownInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Availability Zone"}
                                  help_text={"The Availability Zone for the subnet."}
                                  placeholder={"Select an Availability Zone"}
                                  editable={true}
                                  multi={true}
                                  groups={regions?.data}
                                  groupsDisallowUnselect={true}
                                  options={[
                                    ({ searchPattern, page, perPage, group, pagingDetails }) => {
                                      const data = azs?.data?.filter?.(r => r.value.startsWith(group)) || [];

                                      return new StaticAutocompleter({
                                        data,
                                        filters: { searchPattern, page, perPage, group, pagingDetails },
                                      }).run();
                                    },
                                  ]}
                                ></DropdownInput>
                              ) : value.name == "cidr-block" ? (
                                <TextInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"CIDR block"}
                                  placeholder={"Type a CIDR"}
                                  help_text={"The IPv4 CIDR block of the subnet. The CIDR block you specify must exactly match the subnet's CIDR block for information to be returned for the subnet."}
                                ></TextInput>
                              ) : value.name == "default-for-az" ? (
                                <CheckboxInput
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Default for AZ"}
                                  help_text={"Indicates whether this is the default subnet for the Availability Zone."}
                                ></CheckboxInput>
                              ) : value.name == "ipv6-cidr-block-association.ipv6-cidr-block" ? (
                                <TextInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"IPv6 CIDR block"}
                                  placeholder={"Type a CIDR"}
                                  help_text={"An IPv6 CIDR block associated with the subnet."}
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
                                  help_text={"The state of an IPv6 CIDR block associated with the subnet."}
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
                              ) : value.name == "owner-id" ? (
                                <TextInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Owner ID"}
                                  placeholder={"Type an owner ID"}
                                  help_text={"The AWS account ID of the owner of the subnet."}
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
                                  help_text={"The state of the Subnet."}
                                  editable={true}
                                  multi={true}
                                  options={[
                                    ({ searchPattern, page, perPage, group, pagingDetails }) => {
                                      return new StaticAutocompleter({
                                        data: SUBNET_STATES,
                                        filters: { searchPattern, page, perPage, group, pagingDetails },
                                      }).run();
                                    },
                                  ]}
                                ></DropdownInput>
                              ) : value.name == "subnet-arn" ? (
                                <TextInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Subnet ARN"}
                                  placeholder={"Type an ARN"}
                                  help_text={"The Amazon Resource Name (ARN) of the Subnet."}
                                ></TextInput>
                              ) : value.name == "subnet-id" ? (
                                <TextInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Subnet ID"}
                                  placeholder={"Type a Subnet ID"}
                                  help_text={"The ID of the Subnet."}
                                ></TextInput>
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
                                  help_text={"Use this filter to find all Subnets assigned a tag with a specific key, regardless of the tag value."}
                                ></MultiTextInput>
                              ) : value.name == "vpc-id" ? (
                                <TextInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"VPC ID"}
                                  placeholder={"Type a VPC ID"}
                                  help_text={"The ID of the VPC to which the subnet belongs to."}
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
                    path={"parameters.SubnetIds"}
                    label={"Subnet ID"}
                    help_text={"Filter by specific ID."}
                    editable={true}
                    multi={false}
                    groups={regions?.data}
                    groupsDisallowUnselect={true}
                    options={[
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new StaticAutocompleter({
                          data: dqlResults.subnets,
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run();
                      },
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new SubnetAutocompleter({
                          node: props.node,
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run({ id: `${props.node.id}-parameters.SubnetIds` });
                      },
                    ]}
                    notifications={
                      <>
                        <VariablesTags expected_vars_filter={[
                          subnets_filters,
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
            props.node.prop("data/id") === "find-subnets" ? (
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
