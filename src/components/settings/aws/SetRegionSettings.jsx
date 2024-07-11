import Container from "react-bootstrap/esm/Container";

import { WBody } from "@src/ui/structure/WModal/WBody";
import { WHeader } from "@src/ui/structure/WModal/WHeader";
import { WFooter } from "@src/ui/structure/WModal/WFooter";

import { DropdownInput } from "@src/ui/functionality/DropdownInput";

import { RegionsAutocompleter } from "@src/components/autocompleters/aws/RegionsAutocompleter";

export const SetRegionSettings = (props) => {
  return (
    <Container>
      <WHeader help={props.help}>AWS - Set region</WHeader>

      <WBody>
        <DropdownInput
          node={props.node}
          form={props.form}
          validations={props.validations}
          path={"parameters.Region"}
          label={"Select region"}
          help_text={"The selected region will apply for all API calls performed after this action (unless another 'AWS - Set region' action is used to change it)."}
          editable={true}
          multi={false}
          groups={[
            { label: "Africa", value: "africa" },
            { label: "Asia", value: "asia" },
            { label: "North America", value: "north_america" },
            { label: "South America", value: "south_america" },
            { label: "Europe", value: "europe" },
            { label: "Middle East", value: "middle_east" },
          ]}
          options={[
            ({ searchPattern, page, perPage, group, pagingDetails }) => {
              return new RegionsAutocompleter({
                filters: { searchPattern, page, perPage, group, pagingDetails },
              }).run({ id: `${props.node.id}-parameters.Region` });
            },
          ]}
        ></DropdownInput>
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
