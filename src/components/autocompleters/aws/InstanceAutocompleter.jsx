import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { AWSAutocompleter } from "@src/components/autocompleters/aws/AWSAutocompleter";

export class InstanceAutocompleter extends AWSAutocompleter {
  prerun() {
    const { searchPattern, page, perPage, pagingDetails } = this.filters;

    this.instancesNode = new this.shapes.nebulant.rectangle.vertical.aws.FindInstances();
    this.appendNode(this.instancesNode);
    this.instancesNode.prop("data/autocomplete", true);
    this.instancesNode.prop("data/settings", this.instancesNode.validator.getDefaultValues(), {
      rewrite: true, // don't merge, instead overwrite everything
    });

    this.instancesNode.prop("data/settings/parameters/MaxResults", perPage);
    if(page > 1) {
      this.instancesNode.prop("data/settings/parameters/NextToken", pagingDetails?.auxStorage?.[page]);
    }

    // But we do want to filter by a search term, if there is any
    if(searchPattern) {
      this.addFilterByTag({
        node: this.instancesNode,
        tagValue: `*${searchPattern}*`,
      });
    }
  }

  _createLabel(instanceName, instance) {
    return (
      <Row>
        <Col sm={12} className="d-flex flex-column">
          <span className="fw-bold">{instanceName}</span>
          <span className="small text-muted">{instance.InstanceId} ({instance.InstanceType})</span>
        </Col>
      </Row>
    );
  }

  // This method will process the received data
  process() {
    const { page, pagingDetails } = this.filters;

    const instancesData = this.getResultOfNode(this.instancesNode.id);

    const dataset = instancesData.Reservations || [];

    const data = dataset.map(reservation => {
      const subdataset = reservation.Instances || [];

      return subdataset.map(instance => {
        const instanceName = (instance.Tags || []).find(tag => tag.Key == "Name")?.Value || "";

        return {
          type: "value",
          label: this._createLabel(instanceName, instance),
          value: `${instance.InstanceId}`,
        }
      });
    }).reduce((acc, val) => acc.concat(val), []);

    pagingDetails.auxStorage ??= {};
    pagingDetails.auxStorage[page + 1] = instancesData.NextToken;

    return {
      data: data,
      prev: pagingDetails.auxStorage[page - 1],
      next: pagingDetails.auxStorage[page + 1],
      auxStorage: pagingDetails.auxStorage,
      total: null,
    };
  }
}
