import { useState } from "react";

import Alert from "react-bootstrap/esm/Alert";

import { Runtime } from "@src/core/Runtime";

export const AmiDetails = (props) => {
  const runtime = new Runtime();
  const [ami, setAmi] = useState(null);
  const [amiDetails, setAmiDetails] = useState(null);

  const { amiid } = props;

  if(!amiid) {
    if(amiDetails != null) {
      setAmiDetails(null);
    }

    return "";
  } else if(ami != amiid) {
    if(!amiid.match(/^ami-\w*$/)) {
      if(amiDetails != null) {
        setAmiDetails(null);
      }

      return "";
    }

    setAmi(amiid);

    const builderAssets = runtime.get("objects.builderAssets");

    // Split the current AMI
    const SPLIT_N_CHARS = 4; // If you change this value, make sure to also
    // change it in the assets generator.
    const id = amiid.slice(4); // ignore the first 4 characters ("ami-")
    const chunks = id.slice(0, SPLIT_N_CHARS).split("").join("/");
    const remaining = id.slice(SPLIT_N_CHARS);
    const resultName = `${remaining}.json`;

    builderAssets.get({
      asset_path: `aws/images/${chunks}/${resultName}`,
      version: "1.0.0", // "1.0.0" because these assets won't be updated ever
    }).then(data => {
      setAmiDetails(data);
    }).catch(_err => {
      setAmiDetails(null);
    });
  }

  if(!amiDetails) return "";

  return (
    <>
      <Alert variant="info" className="py-1 small mb-2">
        <div className="text-center mb-3">
          <b>AMI details</b>
        </div>

        <table>
          <tbody>
            <tr>
              <td className="align-text-top text-start text-nowrap fw-bold pe-2 pb-1">Architecture</td>
              <td className="align-text-top">{amiDetails.Architecture}</td>
            </tr>
            <tr>
              <td className="align-text-top text-start text-nowrap fw-bold pe-2 pb-1">Creation date</td>
              <td className="align-text-top">{new Date(amiDetails.CreationDate).toLocaleString()}</td>
            </tr>
            <tr>
              <td className="align-text-top text-start text-nowrap fw-bold pe-2 pb-1">Description</td>
              <td className="align-text-top">{amiDetails.Description}</td>
            </tr>
            <tr>
              <td className="align-text-top text-start text-nowrap fw-bold pe-2 pb-1">Hybervisor</td>
              <td className="align-text-top">{amiDetails.Hypervisor}</td>
            </tr>
            <tr>
              <td className="align-text-top text-start text-nowrap fw-bold pe-2 pb-1">Name</td>
              <td className="align-text-top">{amiDetails.Name}</td>
            </tr>
            <tr>
              <td className="align-text-top text-start text-nowrap fw-bold pe-2 pb-1">Owner ID</td>
              <td className="align-text-top">{amiDetails.OwnerId}</td>
            </tr>
            <tr>
              <td className="align-text-top text-start text-nowrap fw-bold pe-2 pb-1">Platform</td>
              <td className="align-text-top">{amiDetails.PlatformDetails}</td>
            </tr>
            <tr>
              <td className="align-text-top text-start text-nowrap fw-bold pe-2">Virtualization type</td>
              <td className="align-text-top">{amiDetails.VirtualizationType}</td>
            </tr>
          </tbody>
        </table>

      </Alert>

      {
        amiDetails.MarketplaceProductCode && (
          <Alert variant="warning" className="py-1 small">
            This AMI requires a subscription. Check out the product information <a
              className="fw-bold"
              target="_blank"
              rel="noopener noreferrer"
              href={`https://aws.amazon.com/marketplace/pp?sku=${amiDetails.MarketplaceProductCode}`}
            >here</a>.
          </Alert>
        )
      }
    </>
  );
}
