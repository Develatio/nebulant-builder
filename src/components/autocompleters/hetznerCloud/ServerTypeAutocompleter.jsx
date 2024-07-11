import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";

export class ServerTypeAutocompleter extends StaticAutocompleter {
  _createLabel(server) {
    return (
      <Row>
        <Col sm={12} className="d-flex flex-column">
          <span className="d-flex">
            <span className="fw-bold text-muted text-truncate">{server.description}</span>
          </span>
          <span className="small text-muted text-truncate"><b>{server.architecture}</b> CPU with <b>{server.cores}</b> cores, <b>{server.memory} GB</b> RAM, <b>{server.disk} GB</b> disk, <b>{server.included_traffic / Math.pow(1024, 4)} GB</b> included traffic</span>
        </Col>
      </Row>
    );
  }

  prerun() {
    return new Promise((resolve) => {
      this.builderAssets.get({
        asset_id: `hetznerCloud/server_types`,
      }).then(data => {
        this.data = data || [];

        if(this.filters.group === "dedicated") {
          this.data = this.data.filter(r => r.cpu_type === "dedicated");
        } else if(this.filters.group === "shared_x86") {
          this.data = this.data.filter(
            r => r.cpu_type === "shared" && r.architecture === "x86"
          );
        } else if(this.filters.group === "shared_arm") {
          this.data = this.data.filter(
            r => r.cpu_type === "shared" && r.architecture === "arm"
          );
        }

        this.data = this.data?.sort(
          (a, b) => {
            if(a.cores === b.cores) {
              return a.description.localeCompare(b.description)
            }

            return a.cores - b.cores;
          }
        ).map(server => {
          return {
            type: "value",
            label: this._createLabel(server),
            value: server.name,
          }
        });
        resolve();
      }).catch(_err => {
        resolve();
      });
    });
  }
}
