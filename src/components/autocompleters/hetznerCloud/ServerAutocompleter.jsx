import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { clone } from "@src/utils/lang/clone";
import { HetznerCloudAutocompleter } from "@src/components/autocompleters/hetznerCloud/HetznerCloudAutocompleter";

export class ServerAutocompleter extends HetznerCloudAutocompleter {
  prerun() {
    const { searchPattern, page, perPage } = this.filters;

    this.serversNode = new this.shapes.nebulant.rectangle.vertical.hetznerCloud.FindServers();
    this.appendNode(this.serversNode);
    this.serversNode.prop("data/autocomplete", true);
    this.serversNode.prop("data/settings", this.serversNode.validator.getDefaultValues(), {
      rewrite: true, // don't merge, instead overwrite everything
    });

    this.serversNode.prop("data/settings/parameters/PerPage", perPage);
    if(page > 1) {
      this.serversNode.prop("data/settings/parameters/Page", page);
    }

    // But we do want to filter by a search term, if there is any
    if(searchPattern) {
      this.serversNode.prop("data/settings/parameters/Name", searchPattern);
    }
  }

  _createLabel(server) {
    return (
      <Row>
        <Col sm={12} className="d-flex flex-column">
          <span className="fw-bold">{server.name}</span>
          <span className="small text-muted">{server.id} ({server.server_type.description}, {server.datacenter.location.city})</span>
        </Col>
      </Row>
    );
  }

  // This method will process the received data
  process() {
    const { page, perPage } = this.filters;

    const serverData = this.getResultOfNode(this.serversNode.id);

    const dataset = serverData.servers || [];

    const data = dataset.map(server => {
      return {
        type: "value",
        label: this._createLabel(server),
        value: `${server.id}`,
      };
    });

    return {
      rawdata: clone(serverData),
      data: data,
      prev: page > 1,
      next: Math.ceil(serverData.meta.pagination.total_entries / perPage) > page,
      auxStorage: {},
      total: Math.ceil(serverData.meta.pagination.total_entries / perPage),
    };
  }
}
