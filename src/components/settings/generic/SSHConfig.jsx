import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { DiagramQL } from "@src/data/DiagramQL";
import { inferIPs } from "@src/data/utils/inferIPs";

import { TextInput } from "@src/ui/functionality/TextInput";
import { NumericInput } from "@src/ui/functionality/NumericInput";
import { DropdownInput } from "@src/ui/functionality/DropdownInput";
import { PrivateTextInput } from "@src/ui/functionality/PrivateTextInput";
import { SimpleDropdownInput } from "@src/ui/functionality/SimpleDropdownInput";
import { VariablesTags } from "@src/ui/functionality/Dropdown/Notifications/VariablesTags";
import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";

export const SSHConfig = (props) => {
  const dql = new DiagramQL();

  let ips = dql.query(`
    nodes: {
      "parentsOf": ${dql.escape(props.node.id)}
    } | outputVars | find: {
      "capabilities": {
        "$contains": "ip"
      }
    }
  `);

  ips = inferIPs(ips);

  return (
    <>
      <Col sm={12} className="d-flex align-items-start">
        <DropdownInput
          node={props.node}
          form={props.form}
          validations={props.validations}
          path={props.host}
          label={"Machine / IP"}
          help_text={"Picking a cloud objects will run the command / script in it (if a public IP address can be inferred). Otherwise, type an IP address."}
          editable={true}
          multi={false}
          options={[
            ({ searchPattern, page, perPage, group, pagingDetails }) => {
              return new StaticAutocompleter({
                data: ips,
                filters: { searchPattern, page, perPage, group, pagingDetails },
              }).run();
            },
          ]}
          notifications={
            <VariablesTags expected_vars_filter={[
              { capability: ["ip"] },
            ]} />
          }
        ></DropdownInput>

        <NumericInput
          form={props.form}
          validations={props.validations}
          path={props.port}
          label={"Port"}
          placeholder={"Enter a port"}
          help_text={"The port to be used for the remote connection."}
          className="mx-3"
        ></NumericInput>

        <TextInput
          node={props.node}
          form={props.form}
          validations={props.validations}
          path={props.username}
          label={"Username"}
          placeholder={"Enter a username"}
          help_text={"The username to be used for the remote connection."}
        ></TextInput>
      </Col>

      <Col sm={12} className="d-flex align-items-start">
        <Row>
          <Col sm={4}>
            <SimpleDropdownInput
              form={props.form}
              validations={props.validations}
              path={props.credentials}
              label={"Credentials"}
              help_text={"Select the authentication method you want to use."}
              options={[
                { type: "value", label: "Key file", value: "privkeyPath" },
                { type: "value", label: "Private key", value: "privkey" },
                { type: "value", label: "Password", value: "password" },
              ]}
            ></SimpleDropdownInput>
          </Col>
          <Col sm={8} className="mb-3">
            {
              props.form.get(props.credentials) == "privkeyPath" ? (
                <>
                  <TextInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={props.privkeyPath}
                    label={"Key file path"}
                    placeholder={"/home/my_user/.ssh/id_rsa"}
                    help_text={"Full path to the key file or relative path from the working directory of the 'nebulant' binary."}
                  ></TextInput>

                  <PrivateTextInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={props.passphrase}
                    label={"Passphrase"}
                    placeholder={"Enter a passphrase"}
                    help_text={"The passphrase to be used in combination with the private key (leave empty if the private key has no passphrase)."}
                  ></PrivateTextInput>
                </>
              ) : props.form.get(props.credentials) == "privkey" ? (
                <>
                  <PrivateTextInput
                    as={"textarea"}
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={props.privkey}
                    label={"Private key"}
                    placeholder={"-----BEGIN PRIVATE KEY-----"}
                    help_text={"Full path to the key file or relative path from the working directory of the 'nebulant' binary."}
                  ></PrivateTextInput>

                  <PrivateTextInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={props.passphrase}
                    label={"Passphrase"}
                    placeholder={"Enter a passphrase"}
                    help_text={"The passphrase to be used in combination with the private key (leave empty if the private key has no passphrase)."}
                  ></PrivateTextInput>
                </>
              ) : (
                <PrivateTextInput
                  node={props.node}
                  form={props.form}
                  validations={props.validations}
                  path={props.password}
                  label={"Password"}
                  placeholder={""}
                  help_text={"Write the password to be used for the remote connection."}
                ></PrivateTextInput>
              )
            }
          </Col>
        </Row>
      </Col>
    </>
  );
}
