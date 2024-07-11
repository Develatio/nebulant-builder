import { Table } from "react-bootstrap";

import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Alert from "react-bootstrap/esm/Alert";
import Container from "react-bootstrap/esm/Container";

import { Tooltip } from "@src/ui/functionality/Tooltip";

import { AWSAutocompleter } from "@src/components/autocompleters/aws/AWSAutocompleter";

const PermissionsTable = (sg, permissions) => {
  return (
    <Table size="sm" className="mb-0">
      <thead></thead>

      <tbody className="border-0">
        {
          permissions?.map((perm, idx) => {
            let port = perm.FromPort ? `${perm.FromPort}` : "All ports";
            if(perm.FromPort != perm.ToPort) {
              port += `-${perm.ToPort}`;
            }

            const proto = perm.IpProtocol == "-1" ? "All protocols" : perm.IpProtocol;

            return (
              <tr key={idx} className="border border-gray">
                <td className="w-25 text-start text-nowrap border-0 px-2">
                  {proto} - {port}
                </td>

                <td className="text-start d-flex flex-gap-1 border-0 px-2">
                  {
                    perm.IpRanges?.map((range, idx) => {
                      const desc = range.Description ? `- ${range.Description}` : "";
                      return <span
                        key={`1-${idx}`}
                        className={"px-1 text-muted"}
                      >{range.CidrIp} {desc}</span>
                    })
                  }

                  {
                    perm.Ipv6Ranges?.map((range, idx) => {
                      const desc = range.Description ? `- ${range.Description}` : "";
                      return <span
                        key={`2-${idx}`}
                        className={"px-1 text-muted"}
                      >{range.CidrIpv6} {desc}</span>
                    })
                  }

                  {
                    !perm.IpRanges && !perm.Ipv6Ranges ? (
                      <span key={`3-${idx}`} className="text-muted">{sg.GroupId}</span>
                    ) : ""
                  }
                </td>
              </tr>
            );
          })
        }
      </tbody>
    </Table>
  );
}

export class SecurityGroupAutocompleter extends AWSAutocompleter {
  prerun() {
    const { searchPattern, page, perPage, pagingDetails } = this.filters;

    this.securityGroupsNode = new this.shapes.nebulant.rectangle.vertical.aws.FindSecurityGroups();
    this.appendNode(this.securityGroupsNode);
    this.securityGroupsNode.prop("data/autocomplete", true);
    this.securityGroupsNode.prop("data/settings", this.securityGroupsNode.validator.getDefaultValues(), {
      rewrite: true, // don't merge, instead overwrite everything
    });

    this.securityGroupsNode.prop("data/settings/parameters/MaxResults", perPage);
    if(page > 1) {
      this.securityGroupsNode.prop("data/settings/parameters/NextToken", pagingDetails?.auxStorage?.[page]);
    }

    // But we do want to filter by a search term, if there is any
    if(searchPattern) {
      this.addFilter({
        node: this.securityGroupsNode,
        filterObj: {
          name: "group-name",
          value: [searchPattern],
        }
      });
    }
  }

  _createLabel(sg) {
    let name = (sg.Tags || []).find(tag => tag.Key == "Name")?.Value || "";
    if(name) {
      name = `(${name})`;
    }

    const tooltip = (
      <Container className="bg-body py-3">
        <Row>
          <Col sm={6}>
            <Alert key={1} variant="success" className="text-center py-1 mb-0 rounded-bottom-0">Ingress</Alert>
          </Col>
          <Col sm={6}>
            <Alert key={2} variant="danger" className="text-center py-1 mb-0 rounded-bottom-0">Egress</Alert>
          </Col>

          <Col sm={6}>
            {PermissionsTable(sg, sg.IpPermissions)}
          </Col>

          <Col sm={6}>
            {PermissionsTable(sg, sg.IpPermissionsEgress)}
          </Col>
        </Row>
      </Container>
    );

    return (
      <Tooltip placement="auto" label={tooltip} maxWidth={"800px"}>
        <Row>
          <Col sm={12} className="d-flex flex-column">
            <span className="fw-bold">{ sg.GroupName } { name }</span>
            <span className="small text-muted text-truncate">{ sg.Description }</span>
          </Col>
        </Row>
      </Tooltip>
    );
  }

  // This method will process the received data
  process() {
    const { page, pagingDetails } = this.filters;

    const sgsData = this.getResultOfNode(this.securityGroupsNode.id);

    const dataset = sgsData.SecurityGroups || [];

    const data = dataset.map(sg => {
      const label = this._createLabel(sg);

      return {
        type: "value",
        label: label,
        value: `${sg.GroupId}`,
      }
    });

    pagingDetails.auxStorage ??= {};
    pagingDetails.auxStorage[page + 1] = sgsData.NextToken;

    return {
      data: data,
      prev: pagingDetails.auxStorage[page - 1],
      next: pagingDetails.auxStorage[page + 1],
      auxStorage: pagingDetails.auxStorage,
      total: null,
    };
  }
}
