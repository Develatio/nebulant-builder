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

import { Waiters } from "@src/components/settings/common/_Waiters";
import { MaxRetries } from "@src/components/settings/common/_MaxRetries";

import { Heading } from "@src/ui/visual/Heading";
import { TextInput } from "@src/ui/functionality/TextInput";
import { CheckboxInput } from "@src/ui/functionality/CheckboxInput";
import { DropdownInput } from "@src/ui/functionality/DropdownInput";
import { VariablesTags } from "@src/ui/functionality/Dropdown/Notifications/VariablesTags";
import { CliConnectivity } from "@src/ui/functionality/Dropdown/Notifications/CliConnectivity";

import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";
import { LoadBalancerAutocompleter } from "@src/components/autocompleters/hetznerCloud/LoadBalancerAutocompleter";

import { useOneShotState } from "@src/utils/react/useOneShotState";

const load_balancer_filters = { type: "hetznerCloud:load_balancer" };

export const AddServiceToLoadBalancerSettings = (props) => {
  const dql = new DiagramQL();

  const dqlResults = useOneShotState(() => ({
    load_balancers: dql.query(
      dql.vars_for_dropdown({ node: props.node, ...load_balancer_filters })
    ),
  }));

  return (
    <Container>
      <WHeader help={props.help}>Hetzner cloud - Add service to load balancer</WHeader>

      <WBody>
        <Row>
          <Col sm={6}>
            <DropdownInput
              node={props.node}
              form={props.form}
              validations={props.validations}
              path={"parameters.LoadBalancerIds"}
              label={"Load balancer ID"}
              help_text={"Select or type a load balancer ID."}
              editable={true}
              multi={false}
              options={[
                ({ searchPattern, page, perPage, group, pagingDetails }) => {
                  return new StaticAutocompleter({
                    data: dqlResults.load_balancers,
                    filters: { searchPattern, page, perPage, group, pagingDetails },
                  }).run();
                },
                ({ searchPattern, page, perPage, group, pagingDetails }) => {
                  return new LoadBalancerAutocompleter({
                    node: props.node,
                    filters: { searchPattern, page, perPage, group, pagingDetails },
                  }).run({ id: `${props.node.id}-parameters.LoadBalancerIds` });
                },
              ]}
              notifications={
                <>
                  <VariablesTags expected_vars_filter={[
                    load_balancer_filters,
                  ]} />
                  <CliConnectivity />
                </>
              }
            ></DropdownInput>
          </Col>
        </Row>

        <Row>
          <Col sm={3}>
            <DropdownInput
              node={props.node}
              form={props.form}
              validations={props.validations}
              path={`parameters.Protocol`}
              label={"Protocol"}
              help_text={"The protocol that should be used"}
              multi={false}
              options={[
                ({ searchPattern, page, perPage, group, pagingDetails }) => {
                  return new StaticAutocompleter({
                    data: [
                      { label: "TCP", value: "tcp", selected: true },
                      { label: "HTTP", value: "http" },
                      // TODO: Implement HTTPS
                      //{ label: "HTTPS", value: "https" },
                    ],
                    filters: { searchPattern, page, perPage, group, pagingDetails },
                  }).run();
                },
              ]}
            ></DropdownInput>
          </Col>

          <Col sm={3}>
            <TextInput
              node={props.node}
              form={props.form}
              validations={props.validations}
              path={`parameters.SrcPort`}
              label={"Source port"}
              placeholder={"Type a source port"}
              help_text={"The source port for the load balancer"}
            ></TextInput>
          </Col>

          <Col sm={3}>
            <TextInput
              node={props.node}
              form={props.form}
              validations={props.validations}
              path={`parameters.DstPort`}
              label={"Destination port"}
              placeholder={"Type a destination port"}
              help_text={"The destination port for the load balancer"}
            ></TextInput>
          </Col>

          <Col sm={3}>
            <CheckboxInput
              form={props.form}
              validations={props.validations}
              path={`parameters._healthCheck`}
              label={"Health check"}
              help_text={"Enable health check for this service"}
            ></CheckboxInput>
          </Col>
        </Row>

        {
          !props.form.get(`parameters._healthCheck`) ? "" : (
            <>
              <Heading>Health check</Heading>

              <Row>
                <Col sm={3}>
                  <DropdownInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={`parameters.HealthCheck.Protocol`}
                    label={"Protocol"}
                    help_text={"The protocol that should be used"}
                    multi={false}
                    options={[
                      ({ searchPattern, page, perPage, group, pagingDetails }) => {
                        return new StaticAutocompleter({
                          data: [
                            { label: "TCP", value: "tcp", selected: true },
                            { label: "HTTP", value: "http" },
                          ],
                          filters: { searchPattern, page, perPage, group, pagingDetails },
                        }).run();
                      },
                    ]}
                  ></DropdownInput>
                </Col>

                <Col sm={9} className="grid-split-1fr-1fr-1fr align-items-baseline">
                  <TextInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={`parameters.HealthCheck.Interval`}
                    label={"Interval (in s)"}
                    placeholder={"Type an interval"}
                    help_text={"The probing interval"}
                  ></TextInput>

                  <TextInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={`parameters.HealthCheck.Timeout`}
                    label={"Timeout (in s)"}
                    placeholder={"Type a timeout"}
                    help_text={"The tolerable timeout"}
                  ></TextInput>

                  <TextInput
                    node={props.node}
                    form={props.form}
                    validations={props.validations}
                    path={`parameters.HealthCheck.Retries`}
                    label={"Retries"}
                    placeholder={"Type a number"}
                    help_text={"The number of retries before giving up"}
                  ></TextInput>
                </Col>
              </Row>

              {
                props.form.get(`parameters.HealthCheck.Protocol`)[0] === "tcp" ? (
                  <Row>
                    <Col sm={3}>
                      <TextInput
                        node={props.node}
                        form={props.form}
                        validations={props.validations}
                        path={`parameters.HealthCheck.Port`}
                        label={"Port"}
                        placeholder={"Type a port"}
                        help_text={"The port to be probed"}
                      ></TextInput>
                    </Col>
                  </Row>
                ) : props.form.get(`parameters.HealthCheck.Protocol`)[0] === "http" ? (
                  <Row>
                    <Col sm={3}>
                      <CheckboxInput
                        form={props.form}
                        validations={props.validations}
                        path={`parameters.HealthCheck.HTTP.TLS`}
                        label={"Use HTTPS"}
                        help_text={"Use HTTPS when probing the host"}
                      ></CheckboxInput>
                    </Col>

                    <Col sm={3}>
                      <TextInput
                        node={props.node}
                        form={props.form}
                        validations={props.validations}
                        path={`parameters.HealthCheck.HTTP.Domain`}
                        label={"Domain"}
                        placeholder={""}
                        help_text={"The domain that should be tested (without schema)"}
                      ></TextInput>
                    </Col>

                    <Col sm={3}>
                      <TextInput
                        node={props.node}
                        form={props.form}
                        validations={props.validations}
                        path={`parameters.HealthCheck.Port`}
                        label={"Port"}
                        placeholder={"Type a port"}
                        help_text={"The port to be probed"}
                      ></TextInput>
                    </Col>

                    <Col sm={3}>
                      <TextInput
                        node={props.node}
                        form={props.form}
                        validations={props.validations}
                        path={`parameters.HealthCheck.HTTP.Path`}
                        label={"Path"}
                        placeholder={"/"}
                        help_text={"The path (if any)"}
                      ></TextInput>
                    </Col>

                    <Col sm={3}>
                      <TextInput
                        node={props.node}
                        form={props.form}
                        validations={props.validations}
                        path={`parameters.HealthCheck.HTTP.StatusCodes`}
                        label={"Status codes"}
                        placeholder={"2??, 3??"}
                        help_text={"Status codes that will be considered valid. Use '?' to match 1 character or '*' to match multiple characters."}
                      ></TextInput>
                    </Col>

                    <Col sm={9}>
                      <TextInput
                        node={props.node}
                        form={props.form}
                        validations={props.validations}
                        path={`parameters.HealthCheck.HTTP.Response`}
                        label={"Response"}
                        placeholder={""}
                        help_text={"Custom string that must be contained as substring in HTTP response in order to pass the health check."}
                      ></TextInput>
                    </Col>
                  </Row>
                ) : ""
              }

              <Row>
                <Col sm={6}>
                  <CheckboxInput
                    form={props.form}
                    validations={props.validations}
                    path={`parameters.Proxyprotocol`}
                    label={"Proxy protocol"}
                    help_text={"Forwards connection information, such as a client's IP address, to your target servers. It needs to be supported by your application."}
                  ></CheckboxInput>
                </Col>
              </Row>

              {
                props.form.get(`parameters.Protocol`)[0] === "http" ? (
                  <Row>
                    <Col sm={6}>
                      <CheckboxInput
                        form={props.form}
                        validations={props.validations}
                        path={`parameters.HTTP.StickySessions`}
                        label={"Sticky sessions"}
                        help_text={"Binds a session to a particular target server for a configurable time using a cookie."}
                      ></CheckboxInput>
                    </Col>

                    {
                      props.form.get(`parameters.HTTP.StickySessions`) ? (
                        <>
                          <Col sm={3}>
                            <TextInput
                              node={props.node}
                              form={props.form}
                              validations={props.validations}
                              path={`parameters.HTTP.CookieName`}
                              label={"Cookie name"}
                              placeholder={""}
                              help_text={"The name of the cookie that will be used to create the sticky connection"}
                            ></TextInput>
                          </Col>

                          <Col sm={3}>
                            <TextInput
                              node={props.node}
                              form={props.form}
                              validations={props.validations}
                              path={`parameters.HTTP.CookieLifetime`}
                              label={"Cookie lifetime (in s)"}
                              placeholder={""}
                              help_text={"The amount of time before the cookie expires"}
                            ></TextInput>
                          </Col>
                        </>
                      ) : ""
                    }
                  </Row>
                ) : ""
              }
            </>
          )
        }

        <AdvancedSettings>
          <Waiters {...props} />

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
