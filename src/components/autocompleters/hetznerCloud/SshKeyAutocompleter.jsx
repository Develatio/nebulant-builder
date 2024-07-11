import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { HetznerCloudAutocompleter } from "@src/components/autocompleters/hetznerCloud/HetznerCloudAutocompleter";

export class SshKeyAutocompleter extends HetznerCloudAutocompleter {
  prerun() {
    const { searchPattern, page, perPage } = this.filters;

    this.sshkeysNode = new this.shapes.nebulant.rectangle.vertical.hetznerCloud.FindSshKeys();
    this.appendNode(this.sshkeysNode);
    this.sshkeysNode.prop("data/autocomplete", true);
    this.sshkeysNode.prop("data/settings", this.sshkeysNode.validator.getDefaultValues(), {
      rewrite: true, // don't merge, instead overwrite everything
    });

    this.sshkeysNode.prop("data/settings/parameters/PerPage", perPage);
    if(page > 1) {
      this.sshkeysNode.prop("data/settings/parameters/Page", page);
    }

    // But we do want to filter by a search term, if there is any
    if(searchPattern) {
      this.sshkeysNode.prop("data/settings/parameters/Name", searchPattern);
    }
  }

  _createLabel(key) {
    return (
      <Row>
        <Col sm={12} className="d-flex flex-column">
          <span className="fw-bold">{key.name}</span>
          <span className="small text-muted">{key.fingerprint}</span>
        </Col>
      </Row>
    );
  }

  // This method will process the received data
  process() {
    const { page, perPage } = this.filters;

    const sshkeyData = this.getResultOfNode(this.sshkeysNode.id);

    const dataset = sshkeyData.ssh_keys || [];

    const data = dataset.map(key => {
      return {
        type: "value",
        label: this._createLabel(key),
        value: `${key.id}`,
      };
    });

    return {
      data: data,
      prev: page > 1,
      next: Math.ceil(sshkeyData.meta.pagination.total_entries / perPage) > page,
      auxStorage: {},
      total: Math.ceil(sshkeyData.meta.pagination.total_entries / perPage),
    };
  }
}
