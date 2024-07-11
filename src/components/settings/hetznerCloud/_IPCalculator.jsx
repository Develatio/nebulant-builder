import Alert from "react-bootstrap/esm/Alert";

import { NETMASK } from "@src/utils/constants";

export const IPCalculator = ({ addressmask }) => {
  const m = addressmask.match(NETMASK);

  if(!m) {
    return (
      <Alert variant="danger" className="py-1 small">Invalid address / mask</Alert>
    )
  }

  const [, dec0, dec1, dec2, dec3, prefix] = m.map(i => parseInt(i, 10));
  const ipBin = [dec0, dec1, dec2, dec3].map(i => i.toString(2).padStart(8, "0")).join("");

  let classt = "";
  if(dec0 >= 0 && dec0 <= 127) {
    classt = "A";
  } else if(dec0 >= 128 && dec0 <= 191) {
    classt = "B";
  } else if(dec0 >= 192 && dec0 <= 223) {
    classt = "C";
  } else if(dec0 >= 224 && dec0 <= 239) {
    classt = "D";
  } else if(dec0 >= 240 && dec0 <= 255) {
    classt = "E";
  }

  const subnetBits = prefix;

  const mask = "1".repeat(prefix).padEnd(32, "0").match(/.{8}/g);
  const subnetMask = mask.map(i => parseInt(i, 2)).join(".");
  const subnetBin = mask.join("");

  const broadcast = ipBin.substring(0, prefix).padEnd(32, "1");

  const lowEndRange = ipBin.substring(0, prefix).padEnd(24, "0") + "00000001";
  const highEndRange = ipBin.substring(0, prefix).padEnd(24, "1") + "11111110";

  const totalSubnets = Math.pow(2, subnetBits);

  let networkBinary = "";
  for(let i=0; i < 32; i++){
    networkBinary += ipBin[i] == subnetBin[i] ? ipBin[i] : "0";
  }

  const hostsPerSubnet = Math.pow(2, 32 - prefix) - 2;

  return (
    <Alert variant="info" className="py-2 small">
      <table>
        <tbody>
          <tr>
            <td className="align-text-top text-start text-nowrap fw-bold pe-2 pb-1">Class</td>
            <td className="align-text-top font-monospace pb-2">{classt}</td>
          </tr>

          <tr>
            <td className="align-text-top text-start text-nowrap fw-bold pe-2 pb-1">Address</td>
            <td className="align-text-top font-monospace pb-2">
              <span className="d-block">{ipBin.match(/.{8}/g).map(i => parseInt(i, 2)).join(".")}</span>
              <span className="d-block text-smallest text-secondary">{ipBin.match(/.{8}/g).join(".")}</span>
            </td>
          </tr>

          <tr>
            <td className="align-text-top text-start text-nowrap fw-bold pe-2 pb-1">Network</td>
            <td className="align-text-top font-monospace pb-2">
              <span className="d-block">{networkBinary.match(/.{8}/g).map(i => parseInt(i, 2)).join(".")} / {prefix}</span>
              <span className="d-block text-smallest text-secondary">{networkBinary.match(/.{8}/g).join(".")}</span>
            </td>
          </tr>

          <tr>
            <td className="align-text-top text-start text-nowrap fw-bold pe-2 pb-1">Subnet mask</td>
            <td className="align-text-top font-monospace pb-2">
              <span className="d-block">{subnetMask}</span>
              <span className="d-block text-smallest text-secondary">{subnetBin.match(/.{8}/g).join(".")}</span>
            </td>
          </tr>

          <tr>
            <td className="align-text-top text-start fw-bold pe-2 pb-1">Broadcast</td>
            <td className="align-text-top font-monospace pb-2">
              <span className="d-block">{broadcast.match(/.{8}/g).map(i => parseInt(i, 2)).join(".")}</span>
              <span className="d-block text-smallest text-secondary">{broadcast.match(/.{8}/g).join(".")}</span>
            </td>
          </tr>

          <tr>
            <td className="align-text-top text-start fw-bold pe-2 pb-1">Address range</td>
            <td className="align-text-top font-monospace pb-2">
              {lowEndRange.match(/.{8}/g).map(i => parseInt(i, 2)).join(".")} - {highEndRange.match(/.{8}/g).map(i => parseInt(i, 2)).join(".")}
            </td>
          </tr>

          <tr>
            <td className="align-text-top pe-2 pb-1" colSpan={2}>
              With this configuration it would be possible to create <span className="fw-bold">{totalSubnets}</span> subnets and <span className="fw-bold">{hostsPerSubnet}</span> hosts per subnet.</td>
          </tr>
        </tbody>
      </table>
    </Alert>
  );
}
