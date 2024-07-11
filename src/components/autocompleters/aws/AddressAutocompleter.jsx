import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { AWSAutocompleter } from "@src/components/autocompleters/aws/AWSAutocompleter";

export class AddressAutocompleter extends AWSAutocompleter {
  prerun() {
    const { searchPattern, page, perPage, pagingDetails } = this.filters;

    this.addressesNode = new this.shapes.nebulant.rectangle.vertical.aws.FindAddresses();
    this.appendNode(this.addressesNode);
    this.addressesNode.prop("data/autocomplete", true);
    this.addressesNode.prop("data/settings", this.addressesNode.validator.getDefaultValues(), {
      rewrite: true, // don't merge, instead overwrite everything
    });

    this.addressesNode.prop("data/settings/parameters/MaxResults", perPage);
    if(page > 1) {
      this.addressesNode.prop("data/settings/parameters/NextToken", pagingDetails?.auxStorage?.[page]);
    }

    // But we do want to filter by a search term, if there is any
    if(searchPattern) {
      this.addFilterByTag({
        node: this.addressesNode,
        tagValue: `*${searchPattern}*`,
      });
    }
  }

  _createLabel(addressName, address) {
    return (
      <Row>
        <Col sm={12} className="d-flex flex-column">
          <span className="fw-bold">{addressName}</span>
          <span className="small text-muted">{address.PublicIp}</span>
        </Col>
      </Row>
    );
  }

  // This method will process the received data
  process() {
    const { page, pagingDetails } = this.filters;

    const addressesData = this.getResultOfNode(this.addressesNode.id);

    const dataset = addressesData.Addresses || [];

    const data = dataset.map(address => {
      const addressName = (address.Tags || []).find(tag => tag.Key == "Name")?.Value || "";

      return {
        type: "value",
        label: this._createLabel(addressName, address),
        value: `${address.AllocationId}`,
      }
    });

    pagingDetails.auxStorage ??= {};
    pagingDetails.auxStorage[page + 1] = addressesData.NextToken;

    return {
      data: data,
      prev: pagingDetails.auxStorage[page - 1],
      next: pagingDetails.auxStorage[page + 1],
      auxStorage: pagingDetails.auxStorage,
      total: null,
    };
  }
}
