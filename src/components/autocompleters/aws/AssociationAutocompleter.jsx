import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { AddressAutocompleter } from "./AddressAutocompleter";

export class AssociationAutocompleter extends AddressAutocompleter {
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
    const addressesData = this.getResultOfNode(this.addressesNode.id);

    let dataset = addressesData.Addresses || [];

    dataset = dataset.filter(address => address.AssociationId);

    const data = dataset.map(address => {
      const addressName = (address.Tags || []).find(tag => tag.Key == "Name")?.Value || "";

      return {
        type: "value",
        label: this._createLabel(addressName, address),
        value: `${address.AssociationId}`,
      }
    });

    return {
      data: data,
      total: data.length, // TODO <-- fix this
    };
  }
}
