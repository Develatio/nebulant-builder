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
import { RangeInput } from "@src/ui/functionality/RangeInput";
import { DualTextInput } from "@src/ui/functionality/DualTextInput";
import { CheckboxInput } from "@src/ui/functionality/CheckboxInput";
import { DropdownInput } from "@src/ui/functionality/DropdownInput";
import { MultiTextInput } from "@src/ui/functionality/MultiTextInput";
import { OutputVariable } from "@src/ui/structure/NodeSettings/widgets/OutputVariable";
import { VariablesTags } from "@src/ui/functionality/Dropdown/Notifications/VariablesTags";
import { CliConnectivity } from "@src/ui/functionality/Dropdown/Notifications/CliConnectivity";

import { VolumeAutocompleter } from "@src/components/autocompleters/aws/VolumeAutocompleter";
import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";
import { RegionsAutocompleter } from "@src/components/autocompleters/aws/RegionsAutocompleter";
import { InstanceAutocompleter } from "@src/components/autocompleters/aws/InstanceAutocompleter";
import { AvailabilityZonesAutocompleter } from "@src/components/autocompleters/aws/AvailabilityZonesAutocompleter";

import { useOneShotState } from "@src/utils/react/useOneShotState";
import { usePromiseValue } from "@src/utils/react/usePromiseValue";

import { EBS_VOLUME_TYPE } from "./_ebs_volume_types";
import { EBS_VOLUME_STATUS } from "./_ebs_volume_status";
import { EBS_VOLUME_ATTACHMENT_STATUS } from "./_ebs_volume_attachment_status";

const ebss_filters = { type: "aws:volume" };
const instances_filters = { type: "aws:instance" };

export const FindVolumeSettings = (props) => {
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
    ebss: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...ebss_filters })
    ),

    instances: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...instances_filters })
    ),
  }));

  return (
    <Container>
      <WHeader help={props.help}>AWS - Find Volume</WHeader>

      <WBody>
        <Tab.Container defaultActiveKey="filters" activeKey={props.form.get("parameters._activeTab")}>

          <Row className="mt-3">
            <Col sm={12}>
              <Nav variant="pills d-flex justify-content-center align-items-center stylish-tabs">
                <div className="tabsWrapper d-flex">
                  <Nav.Link onClick={() => props.form.set("parameters._activeTab", "filters")} eventKey="filters">Find using filters</Nav.Link>
                  {
                    props.node.prop("data/id") === "find-volume" ? (
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
                    path={"parameters._VolumeName"}
                    label={"Name"}
                    placeholder={"Type a name"}
                    help_text={"The name that will be used to filter volumes."}
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
                      // attachment.attach-time
                      // attachment.delete-on-termination
                      // attachment.device

                      {
                        label: "Instance ID",
                        name: "attachment.instance-id",
                        value: "",
                      },
                      {
                        label: "Attachment status",
                        name: "attachment.status",
                        value: [],
                      },
                      {
                        label: "Availability Zone",
                        name: "availability-zone",
                        value: [],
                      },

                      // create-time

                      {
                        label: "Encrypted",
                        name: "encrypted",
                        value: false,
                      },

                      // multi-attach-enabled
                      // fast-restored

                      {
                        label: "Size",
                        name: "size",
                        value: 1,
                      },

                      // snapshot-id

                      {
                        label: "Status",
                        name: "status",
                        value: [],
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
                      {
                        label: "Volume type",
                        name: "volume-type",
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
                              value.name == "attachment.instance-id" ? (
                                <DropdownInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Instance ID"}
                                  placeholder={"Type an instance ID"}
                                  help_text={"The ID of the instance the volume is attached to."}
                                  editable={true}
                                  multi={true}
                                  groups={regions?.data}
                                  groupsDisallowUnselect={true}
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
                              ) : value.name == "attachment.status" ? (
                                <DropdownInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Attachment state"}
                                  placeholder={"Select an attachment state"}
                                  help_text={"The attachment state."}
                                  editable={true}
                                  multi={true}
                                  options={[
                                    ({ searchPattern, page, perPage, group, pagingDetails }) => {
                                      return new StaticAutocompleter({
                                        data: EBS_VOLUME_ATTACHMENT_STATUS,
                                        filters: { searchPattern, page, perPage, group, pagingDetails },
                                      }).run();
                                    },
                                  ]}
                                ></DropdownInput>
                              ) : value.name == "availability-zone" ? (
                                <DropdownInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Availability Zone"}
                                  placeholder={"Select an availability zone"}
                                  help_text={"The Availability Zone in which the volume is located."}
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
                              ) : value.name == "encrypted" ? (
                                <CheckboxInput
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Encrypted"}
                                  help_text={"Indicates whether the volume is encrypted."}
                                ></CheckboxInput>
                              ) : value.name == "size" ? (
                                <RangeInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  min={1}
                                  max={256000}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Size"}
                                  sliderSuffix={" GiB"}
                                  suffix="GiB"
                                  help_text={"The size of the volume, in GiB."}
                                ></RangeInput>
                              ) : value.name == "status" ? (
                                <DropdownInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Status"}
                                  placeholder={"Select a volume status"}
                                  help_text={"The state of the volume."}
                                  editable={true}
                                  multi={true}
                                  options={[
                                    ({ searchPattern, page, perPage, group, pagingDetails }) => {
                                      return new StaticAutocompleter({
                                        data: EBS_VOLUME_STATUS,
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
                                  help_text={"Use this filter to find all volumes assigned a tag with a specific key, regardless of the tag value."}
                                ></MultiTextInput>
                              ) : value.name == "volume-type" ? (
                                <DropdownInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Volume type"}
                                  placeholder={"Select a volume type"}
                                  help_text={"The virtualization type."}
                                  editable={true}
                                  multi={true}
                                  options={[
                                    ({ searchPattern, page, perPage, group, pagingDetails }) => {
                                      return new StaticAutocompleter({
                                        data: EBS_VOLUME_TYPE,
                                        filters: { searchPattern, page, perPage, group, pagingDetails },
                                      }).run();
                                    },
                                  ]}
                                ></DropdownInput>
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
                    path={"parameters.VolumeIds"}
                    label={"Volume ID"}
                    help_text={"Filter by specific ID."}
                    editable={true}
                    multi={false}
                    groups={regions?.data}
                    groupsDisallowUnselect={true}
                    options={[
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new StaticAutocompleter({
                          data: dqlResults.ebss,
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run();
                      },
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new VolumeAutocompleter({
                          node: props.node,
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run({ id: `${props.node.id}-parameters.VolumeIds` });
                      },
                    ]}
                    notifications={
                      <>
                        <VariablesTags expected_vars_filter={[
                          ebss_filters,
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
            props.node.prop("data/id") === "find-volumes" ? (
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
            label={"Found EBS"}
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
