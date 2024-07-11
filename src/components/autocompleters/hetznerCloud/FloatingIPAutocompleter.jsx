import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { HetznerCloudAutocompleter } from "@src/components/autocompleters/hetznerCloud/HetznerCloudAutocompleter";

export class FloatingIPAutocompleter extends HetznerCloudAutocompleter {
  prerun() {
    const { searchPattern, page, perPage } = this.filters;

    this.floatingIPsNode = new this.shapes.nebulant.rectangle.vertical.hetznerCloud.FindFloatingIPs();
    this.appendNode(this.floatingIPsNode);
    this.floatingIPsNode.prop("data/autocomplete", true);
    this.floatingIPsNode.prop("data/settings", this.floatingIPsNode.validator.getDefaultValues(), {
      rewrite: true, // don't merge, instead overwrite everything
    });

    this.floatingIPsNode.prop("data/settings/parameters/PerPage", perPage);
    if(page > 1) {
      this.floatingIPsNode.prop("data/settings/parameters/Page", page);
    }

    // But we do want to filter by a search term, if there is any
    if(searchPattern) {
      this.floatingIPsNode.prop("data/settings/parameters/Name", searchPattern);
    }
  }

  _createLabel(floatingIp) {
    return (
      <Row>
        <Col sm={12} className="d-flex flex-column">
          <span className="fw-bold">{floatingIp.name}</span>
          <span className="small text-muted">{floatingIp.ip} ({floatingIp.type}, {floatingIp.home_location.city})</span>
        </Col>
      </Row>
    );
  }

  // This method will process the received data
  process() {
    const { page, perPage } = this.filters;

    const floatingIPsData = this.getResultOfNode(this.floatingIPsNode.id);

    const dataset = floatingIPsData.floating_ips || [];

    const data = dataset.map(floatingIp => {
      return {
        type: "value",
        label: this._createLabel(floatingIp),
        value: `${floatingIp.id}`,
      };
    });

    return {
      data: data,
      prev: page > 1,
      next: Math.ceil(floatingIPsData.meta.pagination.total_entries / perPage) > page,
      auxStorage: {},
      total: Math.ceil(floatingIPsData.meta.pagination.total_entries / perPage),
    };
  }
}
