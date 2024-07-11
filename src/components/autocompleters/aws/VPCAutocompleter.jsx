import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { AWSAutocompleter } from "@src/components/autocompleters/aws/AWSAutocompleter";

export class VPCAutocompleter extends AWSAutocompleter {
  prerun() {
    const { searchPattern, page, perPage, pagingDetails } = this.filters;

    this.vpcsNode = new this.shapes.nebulant.rectangle.vertical.aws.FindVPCs();
    this.appendNode(this.vpcsNode);
    this.vpcsNode.prop("data/autocomplete", true);
    this.vpcsNode.prop("data/settings", this.vpcsNode.validator.getDefaultValues(), {
      rewrite: true, // don't merge, instead overwrite everything
    });

    this.vpcsNode.prop("data/settings/parameters/MaxResults", perPage);
    if(page > 1) {
      this.vpcsNode.prop("data/settings/parameters/NextToken", pagingDetails?.auxStorage?.[page]);
    }

    // But we do want to filter by a search term, if there is any
    if(searchPattern) {
      this.addFilterByTag({
        node: this.vpcsNode,
        tagValue: `*${searchPattern}*`,
      });
    }
  }

  _createLabel(name, vpc) {
    return (
      <Row>
        <Col sm={12} className="d-flex flex-column">
          <span className="fw-bold">{name}</span>
          <span className="small text-muted">{vpc.VpcId} ({vpc.CidrBlock})</span>
        </Col>
      </Row>
    );
  }

  // This method will process the received data
  process() {
    const { page, pagingDetails } = this.filters;

    const vpcsData = this.getResultOfNode(this.vpcsNode.id);

    const dataset = vpcsData.Vpcs || [];

    const data = dataset.map(vpc => {
      let name = vpc.Tags?.find(tag => tag.Key == "Name")?.Value || "";

      return {
        type: "value",
        label: this._createLabel(name, vpc),
        value: `${vpc.VpcId}`,
      }
    });

    pagingDetails.auxStorage ??= {};
    pagingDetails.auxStorage[page + 1] = vpcsData.NextToken;

    return {
      data: data,
      prev: pagingDetails.auxStorage[page - 1],
      next: pagingDetails.auxStorage[page + 1],
      auxStorage: pagingDetails.auxStorage,
      total: null,
    };
  }
}
