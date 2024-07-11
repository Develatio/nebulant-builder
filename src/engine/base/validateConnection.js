// This function is used in order to decide whether or not the link that is
// currently being dragged can connect to the target port / magnet
export const validateConnection = function(
  cellViewS,
  magnetS,
  cellViewT,
  magnetT,
  end,
  _linkView
) {
  // Don't allow links to get connected to anything but magnets / ports
  if(!magnetS || !magnetT) return false;

  // Don't allow links' source and target to be the same element
  if(cellViewS === cellViewT) return false;


  // If the user clicked on a link instead of on a port...
  if(cellViewT.model.isLink()) return false;

  // Don't allow links' source and targe to be elements from different
  // groups
  const parentS = cellViewS.model.parent();
  const parentT = cellViewT.model.parent();
  if(
    // if both have a parent, but the parent is not the same...
    // (eg: nodes in different groups)
    // NOTE for myself: how the fuck would that happen¿?
    (parentS && parentT && parentS != parentT)
    ||
    // if the source element doesn't have a parent, but the target does
    // (eg: node on the paper being connected to a node in a group)
    (!parentS && parentT)
    ||
    // if the source element has a parent, but the target doesn't
    // (eg: node in a group being connected to a node on the paper)
    (parentS && !parentT)
  ) return false;

  // Don't allow links to connect to the same port from which they're going out
  if(magnetS === magnetT && end === "target") return false;

  // Don't allow OUT ports to get connected to other OUT ports
  // NOTE: some ports might have a custom markup. If this is the case, the
  // port-group attribute will be accessible only through the parent element
  const pg1 = magnetT.attributes["port-group"];
  const pg2 = magnetT.parentElement.attributes["port-group"];
  if((pg1 || pg2).value != "in") return false;

  return true;
}
