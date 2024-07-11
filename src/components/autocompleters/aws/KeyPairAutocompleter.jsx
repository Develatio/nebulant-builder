import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { AWSAutocompleter } from "@src/components/autocompleters/aws/AWSAutocompleter";

export class KeyPairAutocompleter extends AWSAutocompleter {
  prerun() {
    const { searchPattern, page, perPage, pagingDetails } = this.filters;

    this.keyPairsNode = new this.shapes.nebulant.rectangle.vertical.aws.FindKeyPairs();
    this.appendNode(this.keyPairsNode);
    this.keyPairsNode.prop("data/autocomplete", true);

    this.keyPairsNode.prop("data/settings/parameters/MaxResults", perPage);
    if(page > 1) {
      this.keyPairsNode.prop("data/settings/parameters/NextToken", pagingDetails?.auxStorage?.[page]);
    }

    // We want to ignore the IDs that the user already selected
    const formValues = this.keyPairsNode.validator.getDefaultValues();

    if(searchPattern) {
      formValues.parameters.KeyName = [searchPattern];
    }

    this.keyPairsNode.prop("data/settings", formValues, {
      rewrite: true, // don't merge, instead overwrite everything
    });
  }

  _createLabel(keypair) {
    return (
      <Row>
        <Col sm={12} className="d-flex flex-column">
          <span className="fw-bold">{keypair.KeyName}</span>
          <span className="small text-muted text-truncate">{keypair.KeyFingerprint}</span>
        </Col>
      </Row>
    );
  }

  // This method will process the received data
  process() {
    const { page, pagingDetails } = this.filters;

    const keyPairsData = this.getResultOfNode(this.keyPairsNode.id);

    const dataset = keyPairsData.KeyPairs || [];

    const data = dataset.map(keypair => {
      return {
        type: "value",
        label: this._createLabel(keypair),
        value: `${keypair.KeyPairId}`,
      }
    });

    pagingDetails.auxStorage ??= {};
    pagingDetails.auxStorage[page + 1] = keyPairsData.NextToken;

    return {
      data: data,
      prev: pagingDetails.auxStorage[page - 1],
      next: pagingDetails.auxStorage[page + 1],
      auxStorage: pagingDetails.auxStorage,
      total: null,
    };
  }
}
