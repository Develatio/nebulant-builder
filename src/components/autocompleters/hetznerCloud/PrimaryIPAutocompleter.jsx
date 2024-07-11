import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { HetznerCloudAutocompleter } from "@src/components/autocompleters/hetznerCloud/HetznerCloudAutocompleter";

export class PrimaryIPAutocompleter extends HetznerCloudAutocompleter {
  prerun() {
    const { searchPattern, page, perPage } = this.filters;

    this.primaryIPsNode = new this.shapes.nebulant.rectangle.vertical.hetznerCloud.FindPrimaryIPs();
    this.appendNode(this.primaryIPsNode);
    this.primaryIPsNode.prop("data/autocomplete", true);
    this.primaryIPsNode.prop("data/settings", this.primaryIPsNode.validator.getDefaultValues(), {
      rewrite: true, // don't merge, instead overwrite everything
    });

    this.primaryIPsNode.prop("data/settings/parameters/PerPage", perPage);
    if(page > 1) {
      this.primaryIPsNode.prop("data/settings/parameters/Page", page);
    }

    // But we do want to filter by a search term, if there is any
    if(searchPattern) {
      this.primaryIPsNode.prop("data/settings/parameters/Name", searchPattern);
    }
  }

  _createLabel(primaryIp) {
    return (
      <Row>
        <Col sm={12} className="d-flex flex-column">
          <span className="fw-bold">{primaryIp.name}</span>
          <span className="small text-muted">{primaryIp.ip} ({primaryIp.type}, {primaryIp.datacenter.location.city})</span>
        </Col>
      </Row>
    );
  }

  // This method will process the received data
  process() {
    const { page, perPage } = this.filters;

    const primaryIPsData = this.getResultOfNode(this.primaryIPsNode.id);

    const dataset = primaryIPsData.primary_ips || [];

    const data = dataset.map(primaryIp => {
      return {
        type: "value",
        label: this._createLabel(primaryIp),
        value: `${primaryIp.id}`,
      };
    });

    return {
      data: data,
      prev: page > 1,
      next: Math.ceil(primaryIPsData.meta.pagination.total_entries / perPage) > page,
      auxStorage: {},
      total: Math.ceil(primaryIPsData.meta.pagination.total_entries / perPage),
    };
  }
}
