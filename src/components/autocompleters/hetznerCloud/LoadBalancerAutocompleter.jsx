import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { HetznerCloudAutocompleter } from "@src/components/autocompleters/hetznerCloud/HetznerCloudAutocompleter";

export class LoadBalancerAutocompleter extends HetznerCloudAutocompleter {
  prerun() {
    const { searchPattern, page, perPage } = this.filters;

    this.loadBalancersNode = new this.shapes.nebulant.rectangle.vertical.hetznerCloud.FindLoadBalancers();
    this.appendNode(this.loadBalancersNode);
    this.loadBalancersNode.prop("data/autocomplete", true);
    this.loadBalancersNode.prop("data/settings", this.loadBalancersNode.validator.getDefaultValues(), {
      rewrite: true, // don't merge, instead overwrite everything
    });

    this.loadBalancersNode.prop("data/settings/parameters/PerPage", perPage);
    if(page > 1) {
      this.loadBalancersNode.prop("data/settings/parameters/Page", page);
    }

    // But we do want to filter by a search term, if there is any
    if(searchPattern) {
      this.loadBalancersNode.prop("data/settings/parameters/Name", searchPattern);
    }
  }

  _createLabel(lb) {
    return (
      <Row>
        <Col sm={12} className="d-flex flex-column">
          <span className="fw-bold">{lb.name}</span>
          <span className="small text-muted">{lb.ip} ({lb.id}, {lb.location.city})</span>
        </Col>
      </Row>
    );
  }

  // This method will process the received data
  process() {
    const { page, perPage } = this.filters;

    const loadBalancersData = this.getResultOfNode(this.loadBalancersNode.id);

    const dataset = loadBalancersData.load_balancers || [];

    const data = dataset.map(lb => {
      return {
        type: "value",
        label: this._createLabel(lb),
        value: `${lb.id}`,
      };
    });

    return {
      data: data,
      prev: page > 1,
      next: Math.ceil(loadBalancersData.meta.pagination.total_entries / perPage) > page,
      auxStorage: {},
      total: Math.ceil(loadBalancersData.meta.pagination.total_entries / perPage),
    };
  }
}
