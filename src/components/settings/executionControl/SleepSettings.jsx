import Container from "react-bootstrap/esm/Container";

import { WBody } from "@src/ui/structure/WModal/WBody";
import { WHeader } from "@src/ui/structure/WModal/WHeader";
import { WFooter } from "@src/ui/structure/WModal/WFooter";
import { NumericInput } from "@src/ui/functionality/NumericInput";

export const SleepSettings = (props) => {
  return (
    <Container>
      <WHeader help={props.help}>Sleep settings</WHeader>

      <WBody>
        <NumericInput
          form={props.form}
          validations={props.validations}
          path={"parameters.seconds"}
          label={"Seconds"}
          placeholder={"Type an amount of seconds to idle"}
          help_text={"The execution will be paused for as long as the amount of seconds you specify."}
        ></NumericInput>
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
