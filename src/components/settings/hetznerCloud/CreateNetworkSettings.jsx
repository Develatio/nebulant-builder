import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Container from "react-bootstrap/esm/Container";
import FormLabel from "react-bootstrap/esm/FormLabel";

import { WBody } from "@src/ui/structure/WModal/WBody";
import { WHeader } from "@src/ui/structure/WModal/WHeader";
import { WFooter } from "@src/ui/structure/WModal/WFooter";
import { MaxRetries } from "@src/components/settings/common/_MaxRetries";
import { HasOutput } from "@src/ui/structure/NodeSettings/components/HasOutput";
import { AdvancedSettings } from "@src/ui/structure/NodeSettings/components/AdvancedSettings";
import { ArrayOfWidgets, WidgetRow } from "@src/ui/structure/NodeSettings/components/ArrayOfWidgets";

import { TextInput } from "@src/ui/functionality/TextInput";
import { DualTextInput } from "@src/ui/functionality/DualTextInput";
import { OutputVariable } from "@src/ui/structure/NodeSettings/widgets/OutputVariable";

import { IPCalculator } from "@src/components/settings/hetznerCloud/_IPCalculator";

export const CreateNetworkSettings = (props) => {
  return (
    <Container>
      <WHeader help={props.help}>Hetzner cloud - Create network</WHeader>

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
              help_text={"The name that will be assigned to the created network."}
            ></TextInput>
          </Col>

          <Col sm={6}>
            <TextInput
              node={props.node}
              form={props.form}
              validations={props.validations}
              path={"parameters.AddressMask"}
              label={"Address and mask"}
              placeholder={"Type an address and mask, for example: 172.16.0.0/24"}
              help_text={"The address and mask that will be used to created the network."}
            ></TextInput>
          </Col>

          <Col sm={6}></Col>

          <Col sm={6}>
            <FormLabel>{"\u00A0"}</FormLabel>

            <IPCalculator addressmask={props.form.get("parameters.AddressMask")} />
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
                        help_text1={"Add labels to the created network."}
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
