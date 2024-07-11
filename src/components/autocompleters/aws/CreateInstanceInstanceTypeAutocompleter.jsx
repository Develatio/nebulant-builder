import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { Tooltip } from "@src/ui/functionality/Tooltip";
import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";

export class CreateInstanceInstanceTypeAutocompleter extends StaticAutocompleter {
  _createLabel(instanceType) {
    const tooltip = (
      <div className="d-flex flex-column">
        <span className="fw-bold">{instanceType.InstanceType}</span>
        <span className="small text-muted">{instanceType.Summary}</span>
      </div>
    );

    return (
      <Tooltip placement="auto" label={tooltip}>
        <Row>
          <Col sm={12} className="d-flex flex-column">
            <span className="fw-bold">{instanceType.InstanceType}</span>
            <span className="small text-muted text-truncate">{instanceType.Summary}</span>
          </Col>
        </Row>
      </Tooltip>
    );
  }

  async prerun() {
    await new Promise((resolve) => {
      this.builderAssets.get({ asset_id: "aws/instance_types" }).then(data => {
        this.data = data?.instance_types || [];

        if(this.filters.group) {
          this.data = this.data.filter(it => it.InstanceType.startsWith(this.filters.group));
        }

        this.data = this.data.map(instanceType => {
          return {
            type: "value",
            label: this._createLabel(instanceType),
            value: instanceType.InstanceType,
          }
        });
        resolve();
      }).catch(_err => {
        resolve();
      });
    });
  }
}
