import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
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
import { RangeInput } from "@src/ui/functionality/RangeInput";
import { DualTextInput } from "@src/ui/functionality/DualTextInput";
import { DropdownInput } from "@src/ui/functionality/DropdownInput";
import { OutputVariable } from "@src/ui/structure/NodeSettings/widgets/OutputVariable";

import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";
import { LocationAutocompleter } from "@src/components/autocompleters/hetznerCloud/LocationAutocompleter";

export const CreateVolumeSettings = (props) => {
  const sizeRules = props.node.validator.resolveRules({
    fieldPath: "parameters.Size",
    fieldRules: ["min", "max"],
    data: props.form.values.parameters,
    node: props.node,
  });

  return (
    <Container>
      <WHeader help={props.help}>Hetzner cloud - Create volume</WHeader>

      <WBody>
        <Row>
          <Col sm={6}>
            <TextInput
              node={props.node}
              form={props.form}
              validations={props.validations}
              path={"parameters.Name"}
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
              path={"parameters.Locations"}
              label={"Location"}
              help_text={"The location in which the volume will be created."}
              editable={true}
              multi={false}
              options={[
                ({ searchPattern, page, perPage, group, pagingDetails }) => {
                  return new LocationAutocompleter({
                    filters: { searchPattern, page, perPage, group, pagingDetails },
                  }).run();
                },
              ]}
            ></DropdownInput>
          </Col>

          <Col sm={6}>
            <RangeInput
              node={props.node}
              form={props.form}
              validations={props.validations}
              min={sizeRules.find(r => r.rule == "min")?.value}
              max={sizeRules.find(r => r.rule == "max")?.value}
              path={"parameters.Size"}
              label={"Size"}
              sliderSuffix={" GBs"}
              suffix="GBs"
              help_text={"The size of the volume, in GBs."}
            ></RangeInput>
          </Col>

          <Col sm={6}>
            <DropdownInput
              form={props.form}
              validations={props.validations}
              path={"parameters.Formats"}
              label={"File system format"}
              help_text={"The file system format."}
              editable={true}
              multi={false}
              options={[
                ({ searchPattern, page, perPage, group, pagingDetails }) => {
                  return new StaticAutocompleter({
                    data: [
                      { label: "EXT4", value: "ext4" },
                      { label: "XFS", value: "xfs"},
                    ],
                    filters: { searchPattern, page, perPage, group, pagingDetails },
                  }).run();
                },
              ]}
            ></DropdownInput>
          </Col>
        </Row>

        <ArrayOfWidgets
          form={props.form}
          validations={props.validations}
          path={"parameters.Labels"}
          label="Labels"
          help_text="Add labels"
          choices={[
            {
              label: "Label",
              name: "label",
              value: ["", ""],
              multiple: true,
            },
          ]}
        >
          {
            props.form.get("parameters.Labels").map((value, index) => {
              return (
                <WidgetRow
                  key={value.__uniq}
                  index={index}
                  form={props.form}
                  path={"parameters.Labels"}
                >
                  {
                    value.name == "label" && (
                      <DualTextInput
                        node={props.node}
                        form={props.form}
                        validations={props.validations}
                        path={`parameters.Labels[${index}].value`}
                        prefix1="Key"
                        prefix2="Value"
                        placeholder={"Type a label key"}
                        placeholder2={"Type a label value"}
                        help_text1={"Add labels to the created volume."}
                        className="mb-0"
                      ></DualTextInput>
                    )
                  }
                </WidgetRow>
              )
            })
          }
        </ArrayOfWidgets>

        <AdvancedSettings>
          <Waiters {...props} />

          <MaxRetries className="mb-0" {...props} />
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
