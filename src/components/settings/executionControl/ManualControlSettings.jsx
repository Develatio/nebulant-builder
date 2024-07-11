import Container from "react-bootstrap/esm/Container";

import { WBody } from "@src/ui/structure/WModal/WBody";
import { WHeader } from "@src/ui/structure/WModal/WHeader";
import { WFooter } from "@src/ui/structure/WModal/WFooter";
import { TextInput } from "@src/ui/functionality/TextInput";
import { CheckboxInput } from "@src/ui/functionality/CheckboxInput";

export const ManualControlSettings = (props) => {
  return (
    <Container>
      <WHeader help={props.help}>Manual execution control settings</WHeader>

      <WBody>
        <CheckboxInput
          form={props.form}
          validations={props.validations}
          path={"parameters.ok"}
          label={"OK"}
          help_text={"A Boolean that indicates whether the execution flow should continue through the OK or the KO port."}
        ></CheckboxInput>

        {
          props.form.state.values.parameters.ok ? (
            <TextInput
              node={props.node}
              form={props.form}
              validations={props.validations}
              path={"parameters.okmsg"}
              label={"OK message"}
              placeholder={"Type an optional message that will be printed when the execution control reaches the OK port."}
              help_text={"The content of this input is optional."}
            ></TextInput>
          ) : (
            <TextInput
              node={props.node}
              form={props.form}
              validations={props.validations}
              path={"parameters.komsg"}
              label={"KO message"}
              placeholder={"Type an optional message that will be printed when the execution control reaches the KO port."}
              help_text={"The content of this input is optional."}
            ></TextInput>
          )
        }

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
