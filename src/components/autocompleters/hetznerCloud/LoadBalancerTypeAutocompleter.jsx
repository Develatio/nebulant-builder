import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";

export class LoadBalancerTypeAutocompleter extends StaticAutocompleter {
  _createLabel(lb) {
    return (
      <Row>
        <Col sm={12} className="d-flex flex-column">
          <span className="d-flex">
            <span className="fw-bold text-muted text-truncate">{lb.description}</span>
          </span>
          <span className="small text-muted text-truncate"><b>{lb.max_services}</b> services, <b>{lb.max_targets}</b> targets, <b>{lb.max_connections}</b> connections, <b>{lb.max_assigned_certificates}</b> certificates</span>
        </Col>
      </Row>
    );
  }

  prerun() {
    return new Promise((resolve) => {
      this.builderAssets.get({
        asset_id: `hetznerCloud/load_balancer_types`,
      }).then(data => {
        this.data = data || [];
        this.data = data?.sort((a, b) => a.description.localeCompare(b.description)).map(lb => {
          return {
            type: "value",
            label: this._createLabel(lb),
            value: lb.name,
          }
        });
        resolve();
      }).catch(_err => {
        resolve();
      });
    });
  }
}
