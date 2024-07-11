import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { HetznerCloudAutocompleter } from "@src/components/autocompleters/hetznerCloud/HetznerCloudAutocompleter";

export class FirewallAutocompleter extends HetznerCloudAutocompleter {
  prerun() {
    const { searchPattern, page, perPage } = this.filters;

    this.firewallsNode = new this.shapes.nebulant.rectangle.vertical.hetznerCloud.FindFirewalls();
    this.appendNode(this.firewallsNode);
    this.firewallsNode.prop("data/autocomplete", true);
    this.firewallsNode.prop("data/settings", this.firewallsNode.validator.getDefaultValues(), {
      rewrite: true, // don't merge, instead overwrite everything
    });

    this.firewallsNode.prop("data/settings/parameters/PerPage", perPage);
    if(page > 1) {
      this.firewallsNode.prop("data/settings/parameters/Page", page);
    }

    // But we do want to filter by a search term, if there is any
    if(searchPattern) {
      this.firewallsNode.prop("data/settings/parameters/Name", searchPattern);
    }
  }

  _createLabel(firewall) {
    return (
      <Row>
        <Col sm={12} className="d-flex flex-column">
          <span className="fw-bold">{firewall.name}</span>
          <span className="small text-muted">{firewall.id}</span>
        </Col>
      </Row>
    );
  }

  // This method will process the received data
  process() {
    const { page, perPage } = this.filters;

    const firewallData = this.getResultOfNode(this.firewallsNode.id);

    const dataset = firewallData.firewalls || [];

    const data = dataset.map(firewall => {
      return {
        type: "value",
        label: this._createLabel(firewall),
        value: `${firewall.id}`,
      };
    });

    return {
      data: data,
      prev: page > 1,
      next: Math.ceil(firewallData.meta.pagination.total_entries / perPage) > page,
      auxStorage: {},
      total: Math.ceil(firewallData.meta.pagination.total_entries / perPage),
    };
  }
}
