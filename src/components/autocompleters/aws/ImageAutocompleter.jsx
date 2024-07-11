import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { Icon } from "@src/ui/functionality/Icon";

import AppleIcon from "@src/assets/img/icons/ui/apple.svg?transform";
import LinuxIcon from "@src/assets/img/icons/ui/linux.svg?transform";
import WindowsIcon from "@src/assets/img/icons/ui/windows.svg?transform";

import { Tooltip } from "@src/ui/functionality/Tooltip";
import { AWSAutocompleter } from "@src/components/autocompleters/aws/AWSAutocompleter";

export class ImageAutocompleter extends AWSAutocompleter {
  _createLabel(image) {
    let date = "";
    try {
      date = new Date(image.CreationDate).toLocaleString();
    } catch(_err) {
      // no op
    }

    const iconStyle = { width: "20px" };
    const badge = <div className="align-top me-2 flex-shrink-0">
      <Icon>
        {
          image.PlatformDetails.includes("Linux") ? (
            image.Architecture.includes("mac") ? <AppleIcon style={iconStyle} /> : <LinuxIcon style={iconStyle} />
          ) : image.PlatformDetails.includes("Windows") ? (
            <WindowsIcon style={iconStyle} />
          ) : <AppleIcon style={iconStyle} />
        }
      </Icon>
    </div>

    const tooltip = (
      <div className="d-flex flex-column">
        <span className="d-flex">
          {badge}
          <span className="fw-bold">{image.Name} ({image.ImageId})</span>
        </span>
        <span className="small text-muted">{image.Architecture} - {image.PlatformDetails} - {image.Description} ({date})</span>
      </div>
    );

    return (
      <Tooltip placement="auto" label={tooltip}>
        <Row>
          <Col sm={12} className="d-flex flex-column">
            <span className="d-flex">
              {badge}
              <span className="fw-bold text-muted text-truncate">{image.Name} ({image.ImageId})</span>
            </span>
            <span className="small text-muted text-truncate">{image.Architecture} - {image.PlatformDetails} - {image.Description} ({date})</span>
          </Col>
        </Row>
      </Tooltip>
    );
  }

  run() {
    // We don't need to call any external services
    return new Promise((resolve) => {
      if(!this.filters.searchPattern || this.filters.searchPattern.length < 3) {
        resolve({ data: [], total: 0 });
        return;
      }

      this.builderAssets.search({
        asset_id: "aws/images",
        keyword: this.filters.searchPattern,
        limit: 10,
        offset: 1,
        sort: "-$.CreationDate",
        region: this.filters.group,
      }).then(data => {
        data = data?.map(image => {
          return {
            type: "value",
            label: this._createLabel(image),
            value: image.ImageId,
          }
        });

        resolve({
          data,
          total: data.length,
        });
      }).catch(_err => {
        resolve({ data: [], total: 0 });
      });
    });
  }
}
