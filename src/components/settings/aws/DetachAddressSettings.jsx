import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Container from "react-bootstrap/esm/Container";

import { DiagramQL } from "@src/data/DiagramQL";

import { WBody } from "@src/ui/structure/WModal/WBody";
import { WHeader } from "@src/ui/structure/WModal/WHeader";
import { WFooter } from "@src/ui/structure/WModal/WFooter";
import { HasOutput } from "@src/ui/structure/NodeSettings/components/HasOutput";
import { OutputVariable } from "@src/ui/structure/NodeSettings/widgets/OutputVariable";
import { AdvancedSettings } from "@src/ui/structure/NodeSettings/components/AdvancedSettings";

import { MaxRetries } from "@src/components/settings/common/_MaxRetries";

import { DropdownInput } from "@src/ui/functionality/DropdownInput";
import { VariablesTags } from "@src/ui/functionality/Dropdown/Notifications/VariablesTags";
import { CliConnectivity } from "@src/ui/functionality/Dropdown/Notifications/CliConnectivity";

import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";
import { RegionsAutocompleter } from "@src/components/autocompleters/aws/RegionsAutocompleter";
import { AssociationAutocompleter } from "@src/components/autocompleters/aws/AssociationAutocompleter";

import { useOneShotState } from "@src/utils/react/useOneShotState";
import { usePromiseValue } from "@src/utils/react/usePromiseValue";

const eips_filters = { type: "aws:elastic_ip" };

export const DetachAddressSettings = (props) => {
  const dql = new DiagramQL();

  const regions = usePromiseValue((new RegionsAutocompleter({
    node: props.node,
    filters: { perPage: Infinity },
  })).run(), {});

  const dqlResults = useOneShotState(() => ({
    eips: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...eips_filters })
    ),
  }));

  return (
    <Container>
      <WHeader help={props.help}>AWS - Detach elastic IP</WHeader>

      <WBody>
        <Row>
          <Col sm={12}>
            <DropdownInput
              node={props.node}
              form={props.form}
              validations={props.validations}
              path={"parameters.AssociationId"}
              label={"Association ID"}
              help_text={"Select or type an association ID."}
              editable={true}
              multi={false}
              groups={regions?.data}
              groupsDisallowUnselect={true}
              options={[
                ({ searchPattern, page, perPage, group, pagingDetails }) => {
                  return new StaticAutocompleter({
                    data: dqlResults.eips,
                    filters: { searchPattern, page, perPage, group, pagingDetails },
                  }).run();
                },
                ({ searchPattern, page, perPage, group, pagingDetails }) => {
                  return new AssociationAutocompleter({
                    node: props.node,
                    filters: { searchPattern, page, perPage, group, pagingDetails },
                  }).run({ id: `${props.node.id}-parameters.AssociationId` });
                },
              ]}
              notifications={
                <>
                  <VariablesTags expected_vars_filter={[
                    eips_filters,
                  ]} />
                  <CliConnectivity />
                </>
              }
            ></DropdownInput>
          </Col>
        </Row>

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
