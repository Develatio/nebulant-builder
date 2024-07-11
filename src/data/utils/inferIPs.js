export const inferIPs = (arr) => {

  let smartSuggestions = [];

  // wtf is this shit¿? this is 100% improvable
  arr?.forEach((r, _j) => {
    // AWS
    if(r.type == "aws:instance") {
      smartSuggestions.push({
        node: r,
        suggestion: `{{ ${r.value}.ipAddress }}`,
        label: <span>
          {`{{ ${r.value}.ipAddress }}`}
          <br />
          <small className="text-muted">Use only if EIP is attached, otherwise use the "Find network interface" action</small>
        </span>
      });

      smartSuggestions.push({
        node: r,
        suggestion: `{{ ${r.value}.privateIpAddress }}`,
        label: <span>
          {`{{ ${r.value}.privateIpAddress }}`}
          <br />
          <small className="text-muted">Use only if you're connecting from inside the subnet</small>
        </span>
      });

      smartSuggestions.push({
        node: r,
        suggestion: `{{ ${r.value}.networkInterfaceSet[0].association.publicIp }}`,
        label: <span>
          {`{{ ${r.value}.networkInterfaceSet[0].association.publicIp }}`}
          <br />
          <small className="text-muted">Try to infer the IP from the first network interface</small>
        </span>
      });
    } else if(r.type == "aws:network_interface") {
      smartSuggestions.push({
        node: r,
        suggestion: `{{ ${r.value}.association.publicIp }}`,
      });
    } else if(r.type == "aws:elastic_ip") {
      smartSuggestions.push({
        node: r,
        suggestion: `{{ ${r.value}.publicIp }}`,
      });
    }

    // Hetzner
    else if(r.type == "hetznerCloud:server") {
      smartSuggestions.push({
        node: r,
        suggestion: `{{ ${r.value}.server.private_net[0].ip }}`,
      });
      smartSuggestions.push({
        node: r,
        suggestion: `{{ ${r.value}.server.public_net.ipv4.ip }}`,
      });
      smartSuggestions.push({
        node: r,
        suggestion: `{{ ${r.value}.server.public_net.ipv6.ip }}`,
      });
    }
  });

  smartSuggestions = smartSuggestions.map(smartSuggestion => {
    return {
      rawValue: smartSuggestion.node.value,
      type: "DiagramQL",
      label: smartSuggestion.label ? smartSuggestion.label : smartSuggestion.suggestion,
      value: smartSuggestion.suggestion,
    };
  });

  // Remove duplicates
  smartSuggestions = [...new Map(smartSuggestions.map(v => [v.value, v])).values()];

  return smartSuggestions;
}
