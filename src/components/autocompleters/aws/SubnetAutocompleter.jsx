import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { Tooltip } from "@src/ui/functionality/Tooltip";
import { AWSAutocompleter } from "@src/components/autocompleters/aws/AWSAutocompleter";

export class SubnetAutocompleter extends AWSAutocompleter {
  prerun() {
    const { searchPattern, page, perPage, pagingDetails } = this.filters;

    this.vpcsNode = new this.shapes.nebulant.rectangle.vertical.aws.FindVPCs();
    this.appendNode(this.vpcsNode);
    this.vpcsNode.prop("data/autocomplete", true);
    this.vpcsNode.prop("data/settings", this.vpcsNode.validator.getDefaultValues(), {
      rewrite: true, // don't merge, instead overwrite everything
    });

    // If you have more than 1000 VPCs, well...
    // 1) this won't fetch all of your VPCs
    // 2) wtf are you doing? who are you? why do you need more than 1000 VPCs?
    this.vpcsNode.prop("data/settings/parameters/MaxResults", 1000);

    this.subnetsNode = new this.shapes.nebulant.rectangle.vertical.aws.FindSubnets();
    this.appendNode(this.subnetsNode);
    this.subnetsNode.prop("data/autocomplete", true);
    this.subnetsNode.prop("data/settings", this.subnetsNode.validator.getDefaultValues(), {
      rewrite: true, // don't merge, instead overwrite everything
    });

    this.subnetsNode.prop("data/settings/parameters/MaxResults", perPage);
    if(page > 1) {
      this.subnetsNode.prop("data/settings/parameters/NextToken", pagingDetails?.auxStorage?.[page]);
    }

    // But we do want to filter by a search term, if there is any
    if(searchPattern) {
      this.addFilterByTag({
        node: this.subnetsNode,
        tagValue: `*${searchPattern}*`,
      });
    }
  }

  _createLabel(subnetName, vpcName, subnet) {
    const detail = <>{subnet.SubnetId} ({subnet.CidrBlock}) - {vpcName} ({subnet.VpcId})</>;
    const tooltip = (
      <div className="d-flex flex-column">
        <span className="fw-bold">{subnetName}</span>
        <span className="small text-muted">{detail}</span>
      </div>
    );

    return (
      <Tooltip placement="auto" label={tooltip}>
        <Row>
          <Col sm={12} className="d-flex flex-column">
            <span className="fw-bold">{subnetName || "\u00A0"}</span>
            <span className="small text-muted text-truncate">{detail}</span>
          </Col>
        </Row>
      </Tooltip>
    );
  }

  // This method will process the received data
  process() {
    const { page, pagingDetails } = this.filters;

    const vpcsData = this.getResultOfNode(this.vpcsNode.id);
    const subnetsData = this.getResultOfNode(this.subnetsNode.id);

    const vpcNames = Object.fromEntries(vpcsData.Vpcs.map(vpc => [
      vpc.VpcId, vpc.Tags?.find(tag => tag.Key == "Name")?.Value || ""
    ]));

    const dataset = subnetsData.Subnets || [];

    const data = dataset.map(subnet => {
      let subnetName = (subnet.Tags || []).find(tag => tag.Key == "Name")?.Value || "";
      let vpcName = vpcNames[subnet.VpcId] || "";

      return {
        type: "value",
        label: this._createLabel(subnetName, vpcName, subnet),
        value: `${subnet.SubnetId}`,
      }
    });

    pagingDetails.auxStorage ??= {};
    pagingDetails.auxStorage[page + 1] = subnetsData.NextToken;

    return {
      data: data,
      prev: pagingDetails.auxStorage[page - 1],
      next: pagingDetails.auxStorage[page + 1],
      auxStorage: pagingDetails.auxStorage,
      total: null,
    };
  }
}
