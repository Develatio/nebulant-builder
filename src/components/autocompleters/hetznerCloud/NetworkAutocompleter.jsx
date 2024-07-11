import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { HetznerCloudAutocompleter } from "@src/components/autocompleters/hetznerCloud/HetznerCloudAutocompleter";

export class NetworkAutocompleter extends HetznerCloudAutocompleter {
  prerun() {
    const { searchPattern, page, perPage } = this.filters;

    this.networksNode = new this.shapes.nebulant.rectangle.vertical.hetznerCloud.FindNetworks();
    this.appendNode(this.networksNode);
    this.networksNode.prop("data/autocomplete", true);
    this.networksNode.prop("data/settings", this.networksNode.validator.getDefaultValues(), {
      rewrite: true, // don't merge, instead overwrite everything
    });

    this.networksNode.prop("data/settings/parameters/PerPage", perPage);
    if(page > 1) {
      this.networksNode.prop("data/settings/parameters/Page", page);
    }

    // But we do want to filter by a search term, if there is any
    if(searchPattern) {
      this.networksNode.prop("data/settings/parameters/Name", searchPattern);
    }
  }

  _createLabel(network) {
    const zone = network.subnets.map(s => s.network_zone)[0] || "No network zone";
    return (
      <Row>
        <Col sm={12} className="d-flex flex-column">
          <span className="fw-bold">{network.name}</span>
          <span className="small text-muted">{network.id} ({network.ip_range}, {network.subnets.length} subnets, {zone})</span>
        </Col>
      </Row>
    );
  }

  // This method will process the received data
  process() {
    const { page, perPage } = this.filters;

    const networkData = this.getResultOfNode(this.networksNode.id);

    const dataset = networkData.networks || [];

    const data = dataset.map(network => {
      return {
        type: "value",
        label: this._createLabel(network),
        value: `${network.id}`,
      };
    });

    return {
      rawdata: networkData,
      data: data,
      prev: page > 1,
      next: Math.ceil(networkData.meta.pagination.total_entries / perPage) > page,
      auxStorage: {},
      total: Math.ceil(networkData.meta.pagination.total_entries / perPage),
    };
  }
}
