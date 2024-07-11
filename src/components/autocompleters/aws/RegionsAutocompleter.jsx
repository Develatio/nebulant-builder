import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { Tooltip } from "@src/ui/functionality/Tooltip";
import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";

export class RegionsAutocompleter extends StaticAutocompleter {
  _createLabel(labelChunks) {
    const tooltip = (
      <div className="d-flex flex-column">
        <span>{labelChunks[0]}</span>
        <span className="text-smaller text-muted d-block">{labelChunks[1]}</span>
      </div>
    );

    return (
      <Tooltip placement="auto" label={tooltip}>
        <Row>
          <Col sm={12} className="d-flex flex-column">
            <span>{labelChunks[0]}</span>
            <span className="text-smaller text-muted text-truncate d-block">{labelChunks[1]}</span>
          </Col>
        </Row>
      </Tooltip>
    );
  }

  async prerun() {
    await new Promise((resolve) => {
      this.builderAssets.get({ asset_id: "aws/regions" }).then(data => {
        this.data = data || [];

        let parentRegion = "us-east-1"; // The default region in case nothing else is selected
        if(this.node) {
          const _regions = this.data.map(r => r.value);
          const parentRegionNode = [
            ...this.node.graph.getConnectedElements(this.node, "parents"),
          ].find(node => {
            const isAwsSetRegion = node.attributes.type.endsWith("aws.SetRegion");
            const region = node.prop("data/settings/parameters/Region")?.[0];
            return isAwsSetRegion && _regions.includes(region);
          });
          if(parentRegionNode) {
            parentRegion = parentRegionNode.prop("data/settings/parameters/Region")[0];
          }
        }

        if(this.filters.group === "africa") {
          this.data = this.data.filter(r => r.value.startsWith("af-"));
        } else if(this.filters.group === "asia") {
          this.data = this.data.filter(r => r.value.startsWith("ap-"));
        } else if(this.filters.group === "north_america") {
          this.data = this.data.filter(r => r.value.startsWith("us-") || r.value.startsWith("ca-"));
        } else if(this.filters.group === "south_america") {
          this.data = this.data.filter(r => r.value.startsWith("sa-"));
        } else if(this.filters.group === "europe") {
          this.data = this.data.filter(r => r.value.startsWith("eu-"));
        } else if(this.filters.group === "middle_east") {
          this.data = this.data.filter(r => r.value.startsWith("me-") || r.value.startsWith("il-"));
        }

        this.data = this.data.map(region => {
          const labelChunks = region.label.split(" - ");
          return {
            label: this._createLabel(labelChunks),
            value: region.value,
            selected: region.value === parentRegion,
          };
        });
        resolve();
      }).catch(_err => {
        resolve();
      });
    });
  }
}
