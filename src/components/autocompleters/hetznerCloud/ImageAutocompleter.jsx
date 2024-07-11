import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { HetznerCloudAutocompleter } from "@src/components/autocompleters/hetznerCloud/HetznerCloudAutocompleter";

export class ImageAutocompleter extends HetznerCloudAutocompleter {
  prerun() {
    const { searchPattern, page, perPage } = this.filters;

    this.imagesNode = new this.shapes.nebulant.rectangle.vertical.hetznerCloud.FindImages();
    this.appendNode(this.imagesNode);
    this.imagesNode.prop("data/autocomplete", true);
    this.imagesNode.prop("data/settings", this.imagesNode.validator.getDefaultValues(), {
      rewrite: true, // don't merge, instead overwrite everything
    });

    this.imagesNode.prop("data/settings/parameters/PerPage", perPage);
    if(page > 1) {
      this.imagesNode.prop("data/settings/parameters/Page", page);
    }

    // But we do want to filter by a search term, if there is any
    if(searchPattern) {
      this.imagesNode.prop("data/settings/parameters/Name", searchPattern);
    }

    const Filters = this.imagesNode.prop("data/settings/parameters/Filters");
    const Statusidx = Filters.findIndex(x => x.name === "Status");
    this.imagesNode.prop(`data/settings/parameters/Filters/${Statusidx}/value`, []);
    const Typeidx = Filters.findIndex(x => x.name === "Type");
    this.imagesNode.prop(`data/settings/parameters/Filters/${Typeidx}/value`, ["snapshot", "backup"]);
  }

  _createLabel(image) {
    return (
      <Row>
        <Col sm={12} className="d-flex flex-column">
          <span className="d-flex">
            <span className="fw-bold text-muted text-truncate">{image.description}</span>
          </span>
          <span className="small text-muted text-truncate">{image.architecture}, {new Date(image.created).toLocaleDateString()} ({image.id})</span>
        </Col>
      </Row>
    );
  }

  // This method will process the received data
  process() {
    const { page, perPage } = this.filters;

    const imagesData = this.getResultOfNode(this.imagesNode.id);

    const dataset = imagesData.images || [];

    const data = dataset.map(image => {
      return {
        type: "value",
        label: this._createLabel(image),
        value: `${image.id}`,
      };
    });

    return {
      data: data,
      prev: page > 1,
      next: Math.ceil(imagesData.meta.pagination.total_entries / perPage) > page,
      auxStorage: {},
      total: Math.ceil(imagesData.meta.pagination.total_entries / perPage),
    };
  }
}
