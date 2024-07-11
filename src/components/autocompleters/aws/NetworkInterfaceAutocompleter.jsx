import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { Tooltip } from "@src/ui/functionality/Tooltip";
import { AWSAutocompleter } from "@src/components/autocompleters/aws/AWSAutocompleter";

export class NetworkInterfaceAutocompleter extends AWSAutocompleter {
  prerun() {
    const { searchPattern, page, perPage, pagingDetails } = this.filters;

    this.networkInterfacesNode = new this.shapes.nebulant.rectangle.vertical.aws.FindNetworkInterfaces();
    this.appendNode(this.networkInterfacesNode);
    this.networkInterfacesNode.prop("data/autocomplete", true);
    this.networkInterfacesNode.prop("data/settings", this.networkInterfacesNode.validator.getDefaultValues(), {
      rewrite: true, // don't merge, instead overwrite everything
    });

    this.networkInterfacesNode.prop("data/settings/parameters/MaxResults", perPage);
    if(page > 1) {
      this.networkInterfacesNode.prop("data/settings/parameters/NextToken", pagingDetails?.auxStorage?.[page]);
    }

    // But we do want to filter by a search term, if there is any
    if(searchPattern) {
      this.addFilterByTag({
        node: this.networkInterfacesNode,
        tagValue: `*${searchPattern}*`,
      });
    }
  }

  _createLabel(iface) {
    const tooltip = (
      <div className="d-flex flex-column">
        <span className="small text-muted text-start">Associations: {iface.Association?.map?.(asc => asc.PublicIp)?.join?.(", ")}</span>
        <span className="small text-muted text-start">Private addresses: {iface.PrivateIpAddresses?.map?.(ip => ip.PrivateIpAddress)?.join?.(", ")}</span>
        <span className="small text-muted text-start">IPv6 addresses: {iface.Ipv6Addresses?.map?.(ip => ip.Ipv6Address)?.join?.(", ")}</span>
        <span className="small text-muted text-start">VPC: {iface.VpcId}</span>
        <span className="small text-muted text-start">Subnet: {iface.SubnetId}</span>
        <span className="small text-muted text-start">Availability zone: {iface.AvailabilityZone}</span>
      </div>
    );

    return (
      <Tooltip placement="auto" label={tooltip}>
        <Row>
          <Col sm={12} className="d-flex flex-column">
            <span className="fw-bold">{iface.TagSet?.find?.(t => t.Key === "Name")?.Value || iface.NetworkInterfaceId}</span>
            <span className="small text-muted">{iface.Description}</span>
          </Col>
        </Row>
      </Tooltip>
    );
  }

  // This method will process the received data
  process() {
    const { page, pagingDetails } = this.filters;

    const networkInterfacesData = this.getResultOfNode(this.networkInterfacesNode.id);

    const ifaces = networkInterfacesData.NetworkInterfaces || [];

    const data = ifaces.map(iface => {
      return {
        type: "value",
        label: this._createLabel(iface),
        value: `${iface.NetworkInterfaceId}`,
      }
    });

    pagingDetails.auxStorage ??= {};
    pagingDetails.auxStorage[page + 1] = networkInterfacesData.NextToken;

    return {
      data: data,
      prev: pagingDetails.auxStorage[page - 1],
      next: pagingDetails.auxStorage[page + 1],
      auxStorage: pagingDetails.auxStorage,
      total: null,
    };
  }
}
