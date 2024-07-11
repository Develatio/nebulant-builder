import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { HetznerCloudAutocompleter } from "@src/components/autocompleters/hetznerCloud/HetznerCloudAutocompleter";

export class VolumeAutocompleter extends HetznerCloudAutocompleter {
  prerun() {
    const { searchPattern, page, perPage } = this.filters;

    this.volumesNode = new this.shapes.nebulant.rectangle.vertical.hetznerCloud.FindVolumes();
    this.appendNode(this.volumesNode);
    this.volumesNode.prop("data/autocomplete", true);
    this.volumesNode.prop("data/settings", this.volumesNode.validator.getDefaultValues(), {
      rewrite: true, // don't merge, instead overwrite everything
    });

    this.volumesNode.prop("data/settings/parameters/PerPage", perPage);
    if(page > 1) {
      this.volumesNode.prop("data/settings/parameters/Page", page);
    }

    // But we do want to filter by a search term, if there is any
    if(searchPattern) {
      this.volumesNode.prop("data/settings/parameters/Name", searchPattern);
    }
  }

  _createLabel(volume) {
    return (
      <Row>
        <Col sm={12} className="d-flex flex-column">
          <span className="fw-bold">{volume.name}</span>
          <span className="small text-muted">{volume.id} ({volume.status}, {volume.location.city})</span>
        </Col>
      </Row>
    );
  }

  // This method will process the received data
  process() {
    const { page, perPage } = this.filters;

    const volumeData = this.getResultOfNode(this.volumesNode.id);

    const dataset = volumeData.volumes || [];

    const data = dataset.map(volume => {
      return {
        type: "value",
        label: this._createLabel(volume),
        value: `${volume.id}`,
      };
    });

    return {
      data: data,
      prev: page > 1,
      next: Math.ceil(volumeData.meta.pagination.total_entries / perPage) > page,
      auxStorage: {},
      total: Math.ceil(volumeData.meta.pagination.total_entries / perPage),
    };
  }
}
