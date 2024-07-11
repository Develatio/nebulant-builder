import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { Tooltip } from "@src/ui/functionality/Tooltip";
import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";

export class QuickImageAutocompleter extends StaticAutocompleter {
  _createLabel(image) {
    const tooltip = (
      <div className="d-flex flex-column">
        <span className="d-flex">
          <span className="fw-bold">{image.Name} ({image.ImageId})</span>
        </span>
        <span className="small text-muted">{image.Architecture} - {image.Description}</span>
      </div>
    );

    return (
      <Tooltip placement="auto" label={tooltip}>
        <Row>
          <Col sm={12} className="d-flex flex-column">
            <span className="d-flex">
              <span className="fw-bold text-muted text-truncate">{image.Name} ({image.ImageId})</span>
            </span>
            <span className="small text-muted text-truncate">{image.Architecture} - {image.Description}</span>
          </Col>
        </Row>
      </Tooltip>
    );
  }

  prerun() {
    // We don't need to call any external services
    return new Promise((resolve) => {
      this.builderAssets.get({
        asset_id: `aws/images-quickstart-${this.filters.group}`,
      }).then(data => {
        this.data = data || [];
        this.data = data?.sort((a, b) => a.Name.localeCompare(b.Name)).map(image => {
          return {
            type: "value",
            label: this._createLabel(image),
            value: image.ImageId,
          }
        });
        resolve();
      }).catch(_err => {
        resolve();
      });
    });
  }
}
