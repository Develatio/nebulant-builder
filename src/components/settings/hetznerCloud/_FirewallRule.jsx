import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { TextInput } from "@src/ui/functionality/TextInput";
import { MultiTextInput } from "@src/ui/functionality/MultiTextInput";
import { SimpleDropdownInput } from "@src/ui/functionality/SimpleDropdownInput";
import { ArrayOfWidgets, WidgetRow } from "@src/ui/structure/NodeSettings/components/ArrayOfWidgets";

const Rules = (props) => {
  const {
    path,
    aow_label,
    aow_help_text,
    aow_add_new_text,
  } = props;

  const rules = props.form.get(path);

  return (
    <Row className="my-3">
      <Col sm={12}>

        <ArrayOfWidgets
          form={props.form}
          validations={props.validations}
          path={path}
          label={aow_label}
          help_text={aow_help_text}
          add_new_text={aow_add_new_text}
          choices={[
            {
              label: "New rule",
              name: "new-rule",
              value: {
                Description: "",
                IPs: ["0.0.0.0/0", "::/0"],
                Protocol: "tcp",
                Port: "",
              },
              multiple: true,
            },
          ]}
        >
          {
            rules.map((value, idx) => {
              return (
                <WidgetRow
                  key={value.__uniq}
                  index={idx}
                  itemSize={12}
                  form={props.form}
                  path={path}
                >
                  <Row>
                    <Col sm={12}>
                      <TextInput
                        node={props.node}
                        form={props.form}
                        validations={props.validations}
                        path={`${path}[${idx}].value.Description`}
                        label={"Description"}
                        placeholder={"SSH traffic"}
                        help_text={"Describe what this rule does"}
                      ></TextInput>
                    </Col>

                    <Col sm={6}>
                      <MultiTextInput
                        node={props.node}
                        form={props.form}
                        validations={props.validations}
                        path={`${path}[${idx}].value.IPs`}
                        className="mb-0"
                        label={"Allowed IP addresses"}
                        placeholder={"Type an IP address or a netmask"}
                        help_text={"Type an IP address or a netmasks"}
                      ></MultiTextInput>
                    </Col>

                    <Col sm={3}>
                      <SimpleDropdownInput
                        form={props.form}
                        validations={props.validations}
                        path={`${path}[${idx}].value.Protocol`}
                        label={"Protocol"}
                        help_text={"Select the protocol"}
                        options={[
                          { type: "value", label: "TCP", value: "tcp" },
                          { type: "value", label: "UDP", value: "udp" },
                          { type: "value", label: "ICMP", value: "icmp" },
                          { type: "value", label: "ESP", value: "esp" },
                          { type: "value", label: "GRE", value: "gre" },
                        ]}
                      ></SimpleDropdownInput>
                    </Col>

                    {
                      ["tcp", "udp"].includes(props.form.get(`${path}[${idx}].value.Protocol`)) ? (
                        <Col sm={3}>
                          <div>
                            <TextInput
                              node={props.node}
                              form={props.form}
                              validations={props.validations}
                              path={`${path}[${idx}].value.Port`}
                              label={"Port"}
                              placeholder={"22"}
                              help_text={"Type a port or a range of ports separated by a dash (-)"}
                            ></TextInput>
                          </div>
                        </Col>
                      ) : ""
                    }
                  </Row>
                </WidgetRow>
              )
            })
          }
        </ArrayOfWidgets>

      </Col>
    </Row>
  );
}

export const OutboundRules = (props) => {
  const { node, form, validations, path } = props;

  return (
    <Rules
      node={node}
      form={form}
      validations={validations}
      path={path}
      key="OutboundRules"
      aow_label="Outbound rules"
      aow_help_text="Create outbound rules. All outbound traffic is allowed by default."
      aow_add_new_text="Add new outbound rule"
    />
  );
}

export const InboundRules = (props) => {
  const { node, form, validations, path } = props;

  return (
    <Rules
      node={node}
      form={form}
      validations={validations}
      path={path}
      key="InboundRules"
      aow_label="Inbound rules"
      aow_help_text="Create inbound rules. All inbound traffic is dropped by default."
      aow_add_new_text="Add new inbound rule"
    />
  );
}
