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
import { DualTextInput } from "@src/ui/functionality/DualTextInput";
import { DropdownInput } from "@src/ui/functionality/DropdownInput";
import { OutputVariable } from "@src/ui/structure/NodeSettings/widgets/OutputVariable";

import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";
import { DatacenterAutocompleter } from "@src/components/autocompleters/hetznerCloud/DatacenterAutocompleter";

export const CreatePrimaryIPSettings = (props) => {
  return (
    <Container>
      <WHeader help={props.help}>Hetzner cloud - Create primary IP</WHeader>

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
              help_text={"The name that will be assigned to the created primary IP."}
            ></TextInput>
          </Col>

          <Col sm={6}>
            <DropdownInput
              node={props.node}
              form={props.form}
              validations={props.validations}
              path={"parameters.Datacenters"}
              label={"Datacenter"}
              help_text={"The datacenter in which the primary IP will be created."}
              editable={true}
              multi={false}
              options={[
                ({ searchPattern, page, perPage, group, pagingDetails }) => {
                  return new DatacenterAutocompleter({
                    filters: { searchPattern, page, perPage, group, pagingDetails },
                  }).run();
                },
              ]}
            ></DropdownInput>
          </Col>

          <Col sm={6}>
            <DropdownInput
              form={props.form}
              validations={props.validations}
              path={"parameters.Types"}
              label={"IP type"}
              help_text={"The type of the IP."}
              editable={true}
              multi={false}
              options={[
                ({ searchPattern, page, perPage, group, pagingDetails }) => {
                  return new StaticAutocompleter({
                    data: [
                      { label: "IPv4", value: "ipv4" },
                      { label: "IPv6", value: "ipv6"},
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
                        help_text1={"Add labels to the created primary IP."}
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
          <Waiters
            {...props}
            toggle_help_text="Don't wait for the primary IP to get created"
          />

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
