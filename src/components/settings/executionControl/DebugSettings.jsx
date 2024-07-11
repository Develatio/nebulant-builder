import Container from "react-bootstrap/esm/Container";

import { WBody } from "@src/ui/structure/WModal/WBody";
import { WHeader } from "@src/ui/structure/WModal/WHeader";
import { WFooter } from "@src/ui/structure/WModal/WFooter";
import { MaxRetries } from "@src/components/settings/common/_MaxRetries";
import { AdvancedSettings } from "@src/ui/structure/NodeSettings/components/AdvancedSettings";

export const DebugSettings = (props) => {
  return (
    <Container>
      <WHeader help={props.help}>Debug</WHeader>

      <WBody>
        {
          // Input vars go here
        }

        <AdvancedSettings>
          <MaxRetries className="mb-0" {...props} />
        </AdvancedSettings>
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
