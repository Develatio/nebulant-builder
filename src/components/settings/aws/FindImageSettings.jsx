import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Nav from "react-bootstrap/esm/Nav";
import Tab from "react-bootstrap/esm/Tab";
import Alert from "react-bootstrap/esm/Alert";
import Container from "react-bootstrap/esm/Container";
import FormLabel from "react-bootstrap/esm/FormLabel";

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
import { CliConnectivity } from "@src/ui/functionality/Dropdown/Notifications/CliConnectivity";

import { ImageAutocompleter } from "@src/components/autocompleters/aws/ImageAutocompleter";
import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";
import { RegionsAutocompleter } from "@src/components/autocompleters/aws/RegionsAutocompleter";
import { QuickImageAutocompleter } from "@src/components/autocompleters/aws/QuickImageAutocompleter";

import { usePromiseValue } from "@src/utils/react/usePromiseValue";

import { AmiDetails } from "./_AmiDetails";

import { AMI_TYPE } from "./_ami_type";
import { AMI_OWNERS } from "./_ami_owners";
import { AMI_STATES } from "./_ami_states";
import { ARCHITECTURES } from "./_architectures";
import { HYPERVISOR_TYPE } from "./_hypervisor_type";
import { VIRTUALIZATION_TYPE } from "./_virtualization_type";

export const FindImageSettings = (props) => {
  const regions = usePromiseValue((new RegionsAutocompleter({
    node: props.node,
    filters: { perPage: Infinity },
  })).run(), {});

  return (
    <Container>
      <WHeader help={props.help}>AWS - Find Image</WHeader>

      <WBody>
        <Tab.Container defaultActiveKey="filters" activeKey={props.form.get("parameters._activeTab")}>

          <Row className="mt-3">
            <Col sm={12}>
              <Nav variant="pills d-flex justify-content-center align-items-center stylish-tabs">
                <div className="tabsWrapper d-flex">
                  <Nav.Link onClick={() => props.form.set("parameters._activeTab", "filters")} eventKey="filters">Find using filters</Nav.Link>
                  {
                    props.node.prop("data/id") === "find-image" ? (
                      <>
                        <Nav.Link onClick={() => props.form.set("parameters._activeTab", "id")} eventKey="id">Find by ID</Nav.Link>
                        <Nav.Link onClick={() => props.form.set("parameters._activeTab", "quickstart")} eventKey="quickstart">Quickstart AMIs</Nav.Link>
                      </>
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
                    path={"parameters._ImageName"}
                    label={"Name"}
                    placeholder={"Type a name"}
                    help_text={"The name of the AMI (provided during image creation)."}
                  ></TextInput>
                </Col>

                <Col sm={6} className="d-flex flex-column">
                  <FormLabel>{"\u00A0"}</FormLabel>
                  <Alert variant="info" className="py-1 small">
                    This field behaves like AWS's own search engine, so you'll
                    need to prepend and append wildcards (*) to your search
                    pattern. (eg: '*debian*')
                  </Alert>
                </Col>

                <Col sm={6}>
                  <DropdownInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters._ImageOwners"}
                    label={"Owner"}
                    help_text={"Filter by the owner of the AMI."}
                    placeholder={"Type an owner ID or select one of the options"}
                    editable={true}
                    multi={true}
                    options={[
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new StaticAutocompleter({
                          data: AMI_OWNERS,
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run();
                      },
                    ]}
                  ></DropdownInput>
                </Col>

                <Col sm={6} className="d-flex flex-column">
                  <FormLabel>{"\u00A0"}</FormLabel>
                  <Alert variant="info" className="py-1 small">
                    <code>self</code> is the sender of the request, <code>amazon</code> is the owner
                    of AWS's recommended AMIs and <code>aws-marketplace</code> is AWS's AMI marketplace.
                  </Alert>
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
                        label: "Architecture",
                        name: "architecture",
                        value: [],
                      },

                      // block-device-mapping.delete-on-termination - A Boolean value that indicates whether the Amazon EBS volume is deleted on instance termination.
                      // block-device-mapping.device-name - The device name specified in the block device mapping (for example, /dev/sdh or xvdh).
                      // block-device-mapping.snapshot-id - The ID of the snapshot used for the EBS volume.
                      // block-device-mapping.volume-size - The volume size of the EBS volume, in GiB.
                      // block-device-mapping.volume-type - The volume type of the EBS volume (gp2 | io1 | io2 | st1 | sc1 | standard).
                      // block-device-mapping.encrypted - A Boolean that indicates whether the EBS volume is encrypted.

                      {
                        label: "Description",
                        name: "description",
                        value: "",
                      },
                      {
                        label: "ENA support",
                        name: "ena-support",
                        value: false,
                      },
                      {
                        label: "Hypervisor",
                        name: "hypervisor",
                        value: [],
                      },
                      {
                        label: "Image ID",
                        name: "image-id",
                        value: "",
                      },
                      {
                        label: "Image type",
                        name: "image-type",
                        value: [],
                      },
                      {
                        label: "Public",
                        name: "is-public",
                        value: false,
                      },
                      {
                        label: "Kernel ID",
                        name: "kernel-id",
                        value: "",
                      },

                      // owner-alias - The owner alias, from an Amazon-maintained list (amazon | aws-marketplace). This is not the user-configured AWS account alias set using the IAM console. We recommend that you use the related parameter instead of this filter.

                      {
                        label: "Owner ID",
                        name: "owner-id",
                        value: "",
                      },

                      // platform - The platform. To only list Windows-based AMIs, use windows.
                      // product-code - The product code.
                      // product-code.type - The type of the product code (devpay | marketplace).
                      // ramdisk-id - The RAM disk ID.
                      // root-device-name - The device name of the root device volume (for example, /dev/sda1).
                      // root-device-type - The type of the root device volume (ebs | instance-store).

                      {
                        label: "State",
                        name: "state",
                        value: [],
                      },

                      // state-reason-code - The reason code for the state change.
                      // state-reason-message - The message for the state change.
                      // sriov-net-support - A value of simple indicates that enhanced networking with the Intel 82599 VF interface is enabled.

                      {
                        label: "Tag",
                        name: "tag",
                        value: ["", ""],
                        multiple: true,
                      },
                      {
                        label: "Tag key",
                        name: "tag-key",
                        value: [],
                      },
                      {
                        label: "Virtualization type",
                        name: "virtualization-type",
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
                              value.name == "architecture" ? (
                                <DropdownInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Architecture"}
                                  help_text={"The architecture of the image."}
                                  placeholder={"Select an architecture"}
                                  editable={true}
                                  multi={true}
                                  options={[
                                    ({ searchPattern, page, perPage, group, pagingDetails }) => {
                                      return new StaticAutocompleter({
                                        data: ARCHITECTURES,
                                        filters: { searchPattern, page, perPage, group, pagingDetails },
                                      }).run();
                                    },
                                  ]}
                                ></DropdownInput>
                              ) : value.name == "description" ? (
                                <TextInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Description"}
                                  placeholder={"Type the search term"}
                                  help_text={"The description of the image (provided during image creation)."}
                                ></TextInput>
                              ) : value.name == "ena-support" ? (
                                <CheckboxInput
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"ENA support"}
                                  help_text={"A Boolean that indicates whether enhanced networking with ENA is enabled."}
                                ></CheckboxInput>
                              ) : value.name == "hypervisor" ? (
                                <DropdownInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Hypervisor"}
                                  placeholder={"Select a hypervisor type"}
                                  help_text={"The hypervisor type."}
                                  editable={true}
                                  multi={true}
                                  options={[
                                    ({ searchPattern, page, perPage, group, pagingDetails }) => {
                                      return new StaticAutocompleter({
                                        data: HYPERVISOR_TYPE,
                                        filters: { searchPattern, page, perPage, group, pagingDetails },
                                      }).run();
                                    },
                                  ]}
                                ></DropdownInput>
                              ) : value.name == "image-id" ? (
                                <TextInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Image ID"}
                                  placeholder={"Type an image ID"}
                                  help_text={"The ID of the image."}
                                ></TextInput>
                              ) : value.name == "image-type" ? (
                                <DropdownInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Image type"}
                                  placeholder={"Select an image type"}
                                  help_text={"The image type."}
                                  editable={true}
                                  multi={true}
                                  options={[
                                    ({ searchPattern, page, perPage, group, pagingDetails }) => {
                                      return new StaticAutocompleter({
                                        data: AMI_TYPE,
                                        filters: { searchPattern, page, perPage, group, pagingDetails },
                                      }).run();
                                    },
                                  ]}
                                ></DropdownInput>
                              ) : value.name == "is-public" ? (
                                <CheckboxInput
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Public"}
                                  help_text={"A Boolean that indicates whether the image is public."}
                                ></CheckboxInput>
                              ) : value.name == "kernel-id" ? (
                                <TextInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Kernel ID"}
                                  placeholder={"Type a kernel ID"}
                                  help_text={"The ID of the kernel."}
                                ></TextInput>
                              ) : value.name == "owner-id" ? (
                                <TextInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Owner ID"}
                                  placeholder={"Type an owner ID"}
                                  help_text={"The AWS account ID of the owner. We recommend that you use the related parameter instead of this filter."}
                                ></TextInput>
                              ) : value.name == "state" ? (
                                <DropdownInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"State"}
                                  placeholder={"Select an image state"}
                                  help_text={"The state of the image."}
                                  editable={true}
                                  multi={true}
                                  options={[
                                    ({ searchPattern, page, perPage, group, pagingDetails }) => {
                                      return new StaticAutocompleter({
                                        data: AMI_STATES,
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
                                  help_text={"Use this filter to find all AMIs assigned a tag with a specific key, regardless of the tag value."}
                                ></MultiTextInput>
                              ) : value.name == "virtualization-type" ? (
                                <DropdownInput
                                  node={props.node}
                                  form={props.form}
                                  validations={props.validations}
                                  path={`parameters.Filters[${index}].value`}
                                  className="mb-0"
                                  label={"Virtualization type"}
                                  placeholder={"Select a virtualization type"}
                                  help_text={"The virtualization type."}
                                  editable={true}
                                  multi={true}
                                  options={[
                                    ({ searchPattern, page, perPage, group, pagingDetails }) => {
                                      return new StaticAutocompleter({
                                        data: VIRTUALIZATION_TYPE,
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
                    path={"parameters.ImageIds"}
                    label={"Image ID"}
                    help_text={"Filter by specific ID."}
                    searchPattern="debian"
                    editable={true}
                    multi={false}
                    groups={regions?.data}
                    groupsDisallowUnselect={true}
                    options={[
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new ImageAutocompleter({
                          node: props.node,
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run();
                      },
                    ]}
                    notifications={
                      <CliConnectivity />
                    }
                  ></DropdownInput>
                </Col>

                <Col sm={12} className="d-flex flex-column">
                  <FormLabel>{"\u00A0"}</FormLabel>

                  <AmiDetails amiid={props.form.get("parameters.ImageIds")[0]} />
                </Col>

                {/*
                <Col sm={6}></Col>

                <Col sm={6}>
                  <DropdownInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.ExecutableUsers"}
                    editable={true}
                    multi={true}
                    options={[
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new StaticAutocompleter({
                          data: [
                            {
                              type: "value",
                              label: "self",
                              value: "self",
                            }, {
                              type: "value",
                              label: "all",
                              value: "all",
                            }
                          ],
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run();
                      },
                    ]}
                    label={"Launchable by"}
                    help_text={"'self' is the sender of the request, 'all' are all public AMIs."}
                    placeholder={"Type an accound ID or select one of the options"}
                  ></DropdownInput>
                </Col>
                */}
              </Row>
            </Tab.Pane>

            <Tab.Pane eventKey="quickstart">
              <Row className="my-3">
                <Col sm={12}>
                  <DropdownInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.QuickImageIds"}
                    label={"Image ID"}
                    help_text={"Filter by specific ID."}
                    multi={false}
                    groups={regions?.data}
                    groupsDisallowUnselect={true}
                    options={[
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new QuickImageAutocompleter({
                          node: props.node,
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run();
                      },
                    ]}
                  ></DropdownInput>
                </Col>

                <Col sm={12} className="d-flex flex-column">
                  <FormLabel>{"\u00A0"}</FormLabel>

                  <AmiDetails amiid={props.form.get("parameters.QuickImageIds")[0]} />
                </Col>
              </Row>
            </Tab.Pane>
          </Tab.Content>

        </Tab.Container>

        <AdvancedSettings>
          {
            props.node.prop("data/id") === "find-images" ? (
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
            label={"Found AMI"}
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
