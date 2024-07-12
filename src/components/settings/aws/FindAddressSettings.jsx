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
import { MultiTextInput } from "@src/ui/functionality/MultiTextInput";
import { DropdownInput } from "@src/ui/functionality/DropdownInput";
import { VariablesTags } from "@src/ui/functionality/Dropdown/Notifications/VariablesTags";
import { CliConnectivity } from "@src/ui/functionality/Dropdown/Notifications/CliConnectivity";
import { OutputVariable } from "@src/ui/structure/NodeSettings/widgets/OutputVariable";

import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";
import { RegionsAutocompleter } from "@src/components/autocompleters/aws/RegionsAutocompleter";
import { AddressAutocompleter } from "@src/components/autocompleters/aws/AddressAutocompleter";
import { InstanceAutocompleter } from "@src/components/autocompleters/aws/InstanceAutocompleter";
import { NetworkInterfaceAutocompleter } from "@src/components/autocompleters/aws/NetworkInterfaceAutocompleter";

import { useOneShotState } from "@src/utils/react/useOneShotState";
import { usePromiseValue } from "@src/utils/react/usePromiseValue";

const instances_filters = { type: "aws:instance" };
const eips_filters = { type: "aws:elastic_ip" };
const ifaces_filters = { type: "aws:network_interface" };

export const FindAddressSettings = (props) => {
  const dql = new DiagramQL();

  const regions = usePromiseValue((new RegionsAutocompleter({
    node: props.node,
    filters: { perPage: Infinity },
  })).run(), {});

  const dqlResults = useOneShotState(() => ({
    instances: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...instances_filters })
    ),

    eips: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...eips_filters })
    ),

    ifaces: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...ifaces_filters })
    ),
  }));

  return (
    <Container>
      <WHeader help={props.help}>AWS - Find elastic IP</WHeader>

      <WBody>
        <Tab.Container defaultActiveKey="filters" activeKey={props.form.get("parameters._activeTab")}>

          <Row className="mt-3">
            <Col sm={12}>
              <Nav variant="pills d-flex justify-content-center align-items-center stylish-tabs">
                <div className="tabsWrapper d-flex">
                  <Nav.Link onClick={() => props.form.set("parameters._activeTab", "filters")} eventKey="filters">Find using filters</Nav.Link>
                  {
                    props.node.prop("data/id") === "find-address" ? (
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
                    path={"parameters._EIPName"}
                    label={"Name"}
                    placeholder={"Type a name"}
                    help_text={"The name that will be used to filter addresses."}
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
                        label: "Allocation ID",
                        name: "allocation-id",
                        value: "",
                      },
                      {
                        label: "Association ID",
                        name: "association-id",
                        value: "",
                      },

                      // domain

                      {
                        label: "Instance ID",
                        name: "instance-id",
                        value: [],
                      },

                      {
                        label: "Network border group",
                        name: "network-border-group",
                        value: [],
                      },
                      {
                        label: "Network interface ID",
                        name: "network-interface-id",
                        value: [],
                      },

                      // network-interface-owner-id

                      {
                        label: "Private IP Address",
                        name: "private-ip-address",
                        value: "",
                      },

                      {
                        label: "Public IP Address",
                        name: "public-ip",
                        value: "",
                      },
                      {
                        label: "Tag",
                        name: "tag",
                        value: ["", ""],
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
                              value.name == "allocation-id" ? (
                                <TextInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Allocation ID"}
                                  placeholder={"Type an allocation ID"}
                                  help_text={"The ID of the allocation of the EIP."}
                                ></TextInput>
                              ) : value.name == "association-id" ? (
                                <TextInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Association ID"}
                                  placeholder={"Type an association ID"}
                                  help_text={"The ID of the association of the EIP."}
                                ></TextInput>
                              ) : value.name == "instance-id" ? (
                                <DropdownInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Instance ID"}
                                  placeholder={"Select or type an instance ID"}
                                  help_text={"The ID of the instance the address is associated with."}
                                  editable={true}
                                  multi={true}
                                  options={[
                                    ({ searchPattern, page, perPage, group, pagingDetails }) => {
                                      return new StaticAutocompleter({
                                        data: dqlResults.instances,
                                        filters: { searchPattern, page, perPage, group, pagingDetails },
                                      }).run();
                                    },
                                    ({ searchPattern, page, perPage, group, pagingDetails }) => {
                                      return new InstanceAutocompleter({
                                        node: props.node,
                                        filters: { searchPattern, page, perPage, group, pagingDetails },
                                      }).run({ id: `${props.node.id}-parameters.Filters[${index}].value` });
                                    },
                                  ]}
                                  notifications={
                                    <>
                                      <VariablesTags expected_vars_filter={[
                                        instances_filters,
                                      ]} />
                                      <CliConnectivity />
                                    </>
                                  }
                                ></DropdownInput>
                              ) : value.name == "network-border-group" ? (
                                <DropdownInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Network Border Group"}
                                  placeholder={"Select a network border group"}
                                  help_text={"The Region in which the EIP is located."}
                                  editable={true}
                                  multi={true}
                                  groups={[
                                    { label: "Africa", value: "africa" },
                                    { label: "Asia", value: "asia" },
                                    { label: "North America", value: "north_america" },
                                    { label: "South America", value: "south_america" },
                                    { label: "Europe", value: "europe" },
                                    { label: "Middle East", value: "middle_east" },
                                  ]}
                                  options={[
                                    ({ searchPattern, page, perPage, group, pagingDetails }) => {
                                      return new StaticAutocompleter({
                                        data: regions?.data,
                                        filters: { searchPattern, page, perPage, group, pagingDetails },
                                      }).run();
                                    },
                                  ]}
                                ></DropdownInput>
                              ) : value.name == "network-interface-id" ? (
                                <DropdownInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Network Interface ID"}
                                  placeholder={"Select or type a network interface ID"}
                                  help_text={"The ID of the network interface that the address is associated with."}
                                  editable={true}
                                  multi={true}
                                  options={[
                                    ({ searchPattern, page, perPage, group, pagingDetails }) => {
                                      return new StaticAutocompleter({
                                        data: dqlResults.ifaces,
                                        filters: { searchPattern, page, perPage, group, pagingDetails },
                                      }).run();
                                    },
                                    ({ searchPattern, page, perPage, group, pagingDetails }) => {
                                      return new NetworkInterfaceAutocompleter({
                                        node: props.node,
                                        filters: { searchPattern, page, perPage, group, pagingDetails },
                                      }).run({ id: `${props.node.id}-parameters.Filters[${index}].value` });
                                    },
                                  ]}
                                  notifications={
                                    <>
                                      <VariablesTags expected_vars_filter={[
                                        ifaces_filters,
                                      ]} />
                                      <CliConnectivity />
                                    </>
                                  }
                                ></DropdownInput>
                              ) : value.name == "private-ip-address" ? (
                                <TextInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Private IP Address"}
                                  placeholder={"Type a private IP address"}
                                  help_text={"The private IP address of the EIP."}
                                ></TextInput>
                              ) : value.name == "public-ip" ? (
                                <TextInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Public IP"}
                                  placeholder={"Type a public IP"}
                                  help_text={"The public IP of the EIP."}
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
                                  help_text={"Use this filter to find all addresses assigned a tag with a specific key, regardless of the tag value."}
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
                    path={"parameters.AllocationIds"}
                    label={"Allocation ID"}
                    help_text={"Filter by specific ID."}
                    editable={true}
                    multi={false}
                    groups={regions?.data}
                    groupsDisallowUnselect={true}
                    options={[
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new StaticAutocompleter({
                          data: dqlResults.eips,
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run();
                      },
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new AddressAutocompleter({
                          node: props.node,
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run({ id: `${props.node.id}-parameters.AllocationIds` });
                      },
                    ]}
                    notifications={
                      <>
                        <VariablesTags expected_vars_filter={[
                          eips_filters,
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
            props.node.prop("data/id") === "find-addresses" ? (
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
            label={"Found EIP"}
          ></OutputVariable>
        </HasOutput >
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
