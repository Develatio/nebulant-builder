import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Tab from "react-bootstrap/esm/Tab";
import Nav from "react-bootstrap/esm/Nav";
import Container from "react-bootstrap/esm/Container";

import { WBody } from "@src/ui/structure/WModal/WBody";
import { WHeader } from "@src/ui/structure/WModal/WHeader";
import { WFooter } from "@src/ui/structure/WModal/WFooter";
import { HasOutput } from "@src/ui/structure/NodeSettings/components/HasOutput";
import { AdvancedSettings } from "@src/ui/structure/NodeSettings/components/AdvancedSettings";
import { ArrayOfWidgets, WidgetRow } from "@src/ui/structure/NodeSettings/components/ArrayOfWidgets";

import { Waiters } from "@src/components/settings/common/_Waiters";
import { MaxRetries } from "@src/components/settings/common/_MaxRetries";

import { TextInput } from "@src/ui/functionality/TextInput";
import { CheckboxInput } from "@src/ui/functionality/CheckboxInput";
import { DualTextInput } from "@src/ui/functionality/DualTextInput";
import { DropdownInput } from "@src/ui/functionality/DropdownInput";
import { OutputVariable } from "@src/ui/structure/NodeSettings/widgets/OutputVariable";

import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";
import { RegionsAutocompleter } from "@src/components/autocompleters/aws/RegionsAutocompleter";
import { AvailabilityZonesAutocompleter } from "@src/components/autocompleters/aws/AvailabilityZonesAutocompleter";

import { VolumeTypeSizeSettings } from "@src/components/settings/aws/_VolumeTypeSizeSettings";

import { usePromiseValue } from "@src/utils/react/usePromiseValue";

export const CreateVolumeSettings = (props) => {
  const regions = usePromiseValue((new RegionsAutocompleter({
    node: props.node,
    filters: { perPage: Infinity },
  })).run(), {});

  const azs = usePromiseValue((new AvailabilityZonesAutocompleter({
    node: props.node,
    filters: { perPage: Infinity },
  })).run(), {});

  return (
    <Container>
      <WHeader help={props.help}>AWS - Create Volume</WHeader>

      <WBody>
        <Tab.Container defaultActiveKey="general">

          <Row className="mt-3">
            <Col sm={12}>
              <Nav variant="pills d-flex justify-content-center align-items-center stylish-tabs">
                <div className="tabsWrapper d-flex">
                  <Nav.Link eventKey="general">General</Nav.Link>
                  <Nav.Link eventKey="typesize">Type & Size</Nav.Link>
                </div>
              </Nav>
            </Col>
          </Row>

          <Tab.Content className="pt-3 border-0">
            <Tab.Pane eventKey="general">
              <Row>
                <Col sm={6}>
                  <TextInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters._VolumeName"}
                    label={"Name"}
                    placeholder={"Type a name"}
                    help_text={"The name that will be assigned to the created volume."}
                  ></TextInput>
                </Col>

                <Col sm={6}>
                  <DropdownInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.AvailabilityZone"}
                    label={"Availability Zone"}
                    help_text={"The Availability Zone in which the volume will be created."}
                    editable={true}
                    multi={false}
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
                </Col>
              </Row>

              <Row>
                <Col sm={12}>
                  <CheckboxInput
                    form={props.form}
                    validations={props.validations}
                    path={"parameters.Encrypted"}
                    label={"Encrypted"}
                    help_text={"Indicates whether the volume should be encrypted."}
                  ></CheckboxInput>
                </Col>
              </Row>

              <ArrayOfWidgets
                form={props.form}
                validations={props.validations}
                path={"parameters.TagSpecifications"}
                label="Tags"
                help_text="Apply tags"
                choices={[
                  {
                    label: "Tag",
                    name: "tag",
                    value: ["", ""],
                    multiple: true,
                  },
                ]}
              >
                {
                  props.form.get("parameters.TagSpecifications").map((value, index) => {
                    return (
                      <WidgetRow
                        key={value.__uniq}
                        index={index}
                        form={props.form}
                        path={"parameters.TagSpecifications"}
                      >
                        {
                          value.name == "tag" && (
                            <DualTextInput
                              node={props.node}
                              form={props.form}
                              validations={props.validations}
                              path={`parameters.TagSpecifications[${index}].value`}
                              prefix1="Key"
                              prefix2="Value"
                              placeholder={"Type a tag key"}
                              placeholder2={"Type a tag value"}
                              help_text1={"Apply tags to the created volume."}
                              className="mb-0"
                            ></DualTextInput>
                          )
                        }
                      </WidgetRow>
                    )
                  })
                }
              </ArrayOfWidgets>
            </Tab.Pane>

            <Tab.Pane eventKey="typesize">
              <VolumeTypeSizeSettings {...props} />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>

        {
          // KmsKeyId
          // MultiAttachEnabled
          // OutpostArn
        }

        {
          // SnapshotId
          // TagSpecification.N
        }

        <AdvancedSettings>
          <Waiters
            {...props} // form, validations
            toggle_help_text="Don't wait for the several volume states to be fulfilled"
            dropdown_help_text="The state(s) which the volume should reach before allowing the execution to continue"
            options={[
              {
                type: "value",
                label: "Wait until volume is available",
                value: "WaitUntilVolumeAvailable",
              },
            ]}
          />

          <MaxRetries {...props} />
        </AdvancedSettings>

        <HasOutput>
          <OutputVariable
            form={props.form}
            validations={props.validations}
            path={"outputs.result.value"}
            label={"Created EBS"}
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
