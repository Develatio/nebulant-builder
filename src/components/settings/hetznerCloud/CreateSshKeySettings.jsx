import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Container from "react-bootstrap/esm/Container";

import { WBody } from "@src/ui/structure/WModal/WBody";
import { WHeader } from "@src/ui/structure/WModal/WHeader";
import { WFooter } from "@src/ui/structure/WModal/WFooter";
import { MaxRetries } from "@src/components/settings/common/_MaxRetries";
import { HasOutput } from "@src/ui/structure/NodeSettings/components/HasOutput";
import { AdvancedSettings } from "@src/ui/structure/NodeSettings/components/AdvancedSettings";

import { TextInput } from "@src/ui/functionality/TextInput";
import { DualTextInput } from "@src/ui/functionality/DualTextInput";
import { OutputVariable } from "@src/ui/structure/NodeSettings/widgets/OutputVariable";
import { ArrayOfWidgets, WidgetRow } from "@src/ui/structure/NodeSettings/components/ArrayOfWidgets";

export const CreateSshKeySettings = (props) => {
  return (
    <Container>
      <WHeader help={props.help}>Create SSH key</WHeader>

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
              help_text={"The name that will be assigned to the created SSH key."}
            ></TextInput>
          </Col>

          <Col sm={6}>
            <TextInput
              node={props.node}
              form={props.form}
              validations={props.validations}
              label={"SSH public key"}
              path={"parameters.PublicKey"}
              as={"textarea"}
              rows={6}
              placeholder={"Paste the public key of your SSH key pair"}
            ></TextInput>
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
                        help_text1={"Add labels to the created SSH key."}
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
