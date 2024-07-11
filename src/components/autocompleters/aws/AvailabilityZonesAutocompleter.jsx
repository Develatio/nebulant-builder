import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { Tooltip } from "@src/ui/functionality/Tooltip";
import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";

export class AvailabilityZonesAutocompleter extends StaticAutocompleter {
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
      this.builderAssets.get({ asset_id: "aws/availability_zones" }).then(data => {
        this.data = data || [];

        //let parentRegion = "us-east-1"; // The default region in case nothing else is selected
        //if(this.node) {
        //  const _regions = this.data.map(r => r.value);
        //  const parentRegionNode = [
        //    ...this.node.graph.getConnectedElements(this.node, "parents"),
        //  ].find(node => {
        //    const isAwsSetRegion = node.attributes.type.endsWith("aws.SetRegion");
        //    const region = node.prop("data/settings/parameters/Region")?.[0];
        //    return isAwsSetRegion && _regions.includes(region);
        //  });
        //  if(parentRegionNode) {
        //    parentRegion = parentRegionNode.prop("data/settings/parameters/Region")[0];
        //  }
        //}

        //let oneSelected = false;
        this.data = this.data.map(region => {
          const labelChunks = region.label.split(" - ");
          return {
            label: this._createLabel(labelChunks),
            value: region.value,

            // This line is commented as it doesn't make sense to pre-select a
            // value here. This is because this autocompleter's result will be
            // always used as the `options` prop of dropdowns, never as the
            // `groups`. The selected value in `options` is determined by the
            // `values` prop (which is derived from the node's form + path), not
            // by the `selected` property of each option.
            // Nevertheless, I'm leaving this code here just in case we hit an
            // edge case where we could actually use AZs as `groups` prop.
            //selected: !oneSelected && region.value.startsWith(parentRegion) && (oneSelected = true),
          };
        });
        resolve();
      }).catch(_err => {
        resolve();
      });
    });
  }
}
