import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { clone } from "@src/utils/lang/clone";
import { Tooltip } from "@src/ui/functionality/Tooltip";
import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";

export class LocationAutocompleter extends StaticAutocompleter {
  _createLabel(location) {
    const tooltip = (
      <div className="d-flex flex-column">
        <span>{location.city} ({location.country})</span>
        <span className="text-smaller text-muted d-block">{location.description} ({location.network_zone})</span>
      </div>
    );

    return (
      <Tooltip placement="auto" label={tooltip}>
        <Row>
          <Col sm={12} className="d-flex flex-column">
            <span>{location.city} ({location.country})</span>
            <span className="text-smaller text-muted text-truncate d-block">{location.description} ({location.network_zone})</span>
          </Col>
        </Row>
      </Tooltip>
    );
  }

  async prerun() {
    await new Promise((resolve) => {
      this.builderAssets.get({ asset_id: "hetznerCloud/locations" }).then(data => {
        this.data = data || [];

        this.rawdata = clone(this.data);
        this.data = this.data.map(location => {
          return {
            label: this._createLabel(location),
            value: location.name,
          };
        });
        resolve();
      }).catch(_err => {
        resolve();
      });
    });
  }
}
