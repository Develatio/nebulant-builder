import Container from "react-bootstrap/esm/Container";

import { WBody } from "@src/ui/structure/WModal/WBody";
import { WHeader } from "@src/ui/structure/WModal/WHeader";
import { WFooter } from "@src/ui/structure/WModal/WFooter";

import { TextInput } from "@src/ui/functionality/TextInput";

export const HaltSettings = (props) => {
  return (
    <Container>
      <WHeader help={props.help}>Halt</WHeader>

      <WBody>
        <TextInput
          node={props.node}
          form={props.form}
          validations={props.validations}
          label={"Content"}
          path={"parameters.content"}
          as={"textarea"}
          placeholder={"Type the content you wish the CLI to print to STDOUT when this point is reached during the execution of the blueprint"}
        ></TextInput>
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
