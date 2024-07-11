import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { AWSAutocompleter } from "@src/components/autocompleters/aws/AWSAutocompleter";

export class VolumeAutocompleter extends AWSAutocompleter {
  prerun() {
    const { searchPattern, page, perPage, pagingDetails } = this.filters;

    this.volumesNode = new this.shapes.nebulant.rectangle.vertical.aws.FindVolumes();
    this.appendNode(this.volumesNode);
    this.volumesNode.prop("data/autocomplete", true);
    this.volumesNode.prop("data/settings", this.volumesNode.validator.getDefaultValues(), {
      rewrite: true, // don't merge, instead overwrite everything
    });

    this.volumesNode.prop("data/settings/parameters/MaxResults", perPage);
    if(page > 1) {
      this.volumesNode.prop("data/settings/parameters/NextToken", pagingDetails?.auxStorage?.[page]);
    }

    // But we do want to filter by a search term, if there is any
    if(searchPattern) {
      this.addFilterByTag({
        node: this.volumesNode,
        tagValue: `*${searchPattern}*`,
      });
    }
  }

  _createLabel(volumeName, volume) {
    return (
      <Row>
        <Col sm={12} className="d-flex flex-column">
          <span className="fw-bold">{volumeName}</span>
          <span className="small text-muted">{volume.VolumeId} ({volume.Size}gb)</span>
        </Col>
      </Row>
    );
  }

  // This method will process the received data
  process() {
    const { page, pagingDetails } = this.filters;

    const volumesData = this.getResultOfNode(this.volumesNode.id);

    const dataset = volumesData.Volumes || [];

    const volumesNames = Object.fromEntries(dataset.map(volume => [
      volume.VolumeId, volume.Tags?.find(tag => tag.Key == "Name")?.Value || ""
    ]));

    const data = dataset.map(volume => {
      const volumeName = volumesNames[volume.VolumeId];

      return {
        type: "value",
        label: this._createLabel(volumeName, volume),
        value: `${volume.VolumeId}`,
      }
    });

    pagingDetails.auxStorage ??= {};
    pagingDetails.auxStorage[page + 1] = volumesData.NextToken;

    return {
      data: data,
      prev: pagingDetails.auxStorage[page - 1],
      next: pagingDetails.auxStorage[page + 1],
      auxStorage: pagingDetails.auxStorage,
      total: null,
    };
  }
}
