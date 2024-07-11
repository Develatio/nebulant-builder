import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";

export class DatacenterAutocompleter extends StaticAutocompleter {
  _createLabel(datacenter) {
    return (
      <Row>
        <Col sm={12} className="d-flex flex-column">
          <span>{datacenter.city} ({datacenter.country})</span>
          <span className="text-smaller text-muted text-truncate d-block">{datacenter.description} ({datacenter.name}, {datacenter.network_zone})</span>
        </Col>
      </Row>
    );
  }

  async prerun() {
    await new Promise((resolve) => {
      this.builderAssets.get({ asset_id: "hetznerCloud/datacenters" }).then(data => {
        this.data = data || [];

        this.data = this.data.map(datacenter => {
          return {
            label: this._createLabel(datacenter),
            value: datacenter.name,
          };
        });
        resolve();
      }).catch(_err => {
        resolve();
      });
    });
  }
}
