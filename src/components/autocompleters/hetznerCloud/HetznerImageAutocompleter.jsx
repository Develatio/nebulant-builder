import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";

export class HetznerImageAutocompleter extends StaticAutocompleter {
  _createLabel(image) {
    return (
      <Row>
        <Col sm={12} className="d-flex flex-column">
          <span className="d-flex">
            <span className="fw-bold text-muted text-truncate">{image.description}</span>
          </span>
          <span className="small text-muted text-truncate">{image.architecture}, {new Date(image.created).toLocaleDateString()} ({image.id})</span>
        </Col>
      </Row>
    );
  }

  prerun() {
    return new Promise((resolve) => {
      this.builderAssets.get({
        asset_id: `hetznerCloud/${this.filters.group}`,
      }).then(data => {
        this.data = data || [];
        this.data = data?.sort((a, b) => a.description.localeCompare(b.description)).map(image => {
          return {
            type: "value",
            label: this._createLabel(image),
            value: `${image.id}`,
          }
        });
        resolve();
      }).catch(_err => {
        resolve();
      });
    });
  }
}
