import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Container from "react-bootstrap/esm/Container";

import { WBody } from "@src/ui/structure/WModal/WBody";
import { WHeader } from "@src/ui/structure/WModal/WHeader";
import { WFooter } from "@src/ui/structure/WModal/WFooter";
import { MaxRetries } from "@src/components/settings/common/_MaxRetries";
import { HasOutput } from "@src/ui/structure/NodeSettings/components/HasOutput";
import { OutputVariable } from "@src/ui/structure/NodeSettings/widgets/OutputVariable";
import { AdvancedSettings } from "@src/ui/structure/NodeSettings/components/AdvancedSettings";
import { ArrayOfWidgets, WidgetRow } from "@src/ui/structure/NodeSettings/components/ArrayOfWidgets";

import { TextInput } from "@src/ui/functionality/TextInput";
import { DualTextInput } from "@src/ui/functionality/DualTextInput";
import { DropdownInput } from "@src/ui/functionality/DropdownInput";

import { RegionsAutocompleter } from "@src/components/autocompleters/aws/RegionsAutocompleter";

export const AllocateAddressSettings = (props) => {
  return (
    <Container>
      <WHeader help={props.help}>AWS - Allocate elastic IP</WHeader>

      <WBody>
        <Row>
          <Col sm={6}>
            <TextInput
              node={props.node}
              form={props.form}
              validations={props.validations}
              path={"parameters._EIPName"}
              label={"Name"}
              placeholder={"Type a name"}
              help_text={"The name that will be assigned to the created EIP."}
            ></TextInput>

            {
              // CustomerOwnedIpv4Pool
              // Domain
            }
          </Col>

          <Col sm={6}>
            <DropdownInput
              node={props.node}
              form={props.form}
              validations={props.validations}
              path={"parameters.NetworkBorderGroup"}
              label={"Network Border Group"}
              help_text={"The region in which to allocate the EIP."}
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
                  }).run({ id: `${props.node.id}-parameters.NetworkBorderGroup` });
                },
              ]}
            ></DropdownInput>

            {
              // PublicIpv4Pool
            }
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
                    value.name == "tag" ? (
                      <DualTextInput
                        node={props.node}
                        form={props.form}
                        validations={props.validations}
                        path={`parameters.TagSpecifications[${index}].value`}
                        prefix1="Key"
                        prefix2="Value"
                        placeholder={"Type a tag key"}
                        placeholder2={"Type a tag value"}
                        help_text1={"Apply tags to the address."}
                        className="mb-0"
                      ></DualTextInput>
                    ) : ""
                  }
                </WidgetRow>
              )
            })
          }
        </ArrayOfWidgets>

        {/*
        <TextInput
          node={props.node}
          form={props.form}
          validations={props.validations}
          path={"parameters.Address"}
          label={"Address"}
          placeholder={"Type an IP"}
          help_text={"Use this only if you want to recover an elastic IP or an IPv4 address from an address pool."}
        ></TextInput>
        */}

        <AdvancedSettings>
          <MaxRetries {...props} />
        </AdvancedSettings>

        <HasOutput>
          <OutputVariable
            form={props.form}
            validations={props.validations}
            path={"outputs.result.value"}
            label={"Allocated EIP"}
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
