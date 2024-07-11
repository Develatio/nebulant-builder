import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { clone } from "@src/utils/lang/clone";
import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";

export class NetworkZoneAutocompleter extends StaticAutocompleter {
  _createLabel(network_zone) {
    return (
      <Row>
        <Col sm={12} className="d-flex flex-column">
          <span>{network_zone.label}</span>
        </Col>
      </Row>
    );
  }

  async prerun() {
    await new Promise((resolve) => {
      this.builderAssets.get({ asset_id: "hetznerCloud/network_zones" }).then(data => {
        this.data = data || [];

        this.rawdata = clone(this.data);
        this.data = this.data.map(network_zone => {
          return {
            label: this._createLabel(network_zone),
            value: `${network_zone.value}`,
          };
        });
        resolve();
      }).catch(_err => {
        resolve();
      });
    });
  }
}
