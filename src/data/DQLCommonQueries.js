export class DQLCommonQueries {
  // "type" and "capability" can be either string or arrays of strings
  vars_for_dropdown({ node, type, capability }) {
    if(type) {
      if(typeof type === "string") type = [type];
    }

    if(capability) {
      if(typeof capability === "string") capability = [capability];
    }

    let qs = "nodes";

    if(node) {
      qs += `: {
        "parentsOf": ${this.escape(node.id)}
      }`;
    }

    qs += "| outputVars ";

    if(type) {
      qs += "| find: {";

      if(type) {
        qs += `
          "type": {
            "$in": ${JSON.stringify(type)}
          }
        `;
      }

      if(capability) {
        qs += `
          "capabilities": {
            "$in": ${JSON.stringify(capability)}
          }
        `
      }

      qs += "}";
    }

    qs += "| toDropdownValues";

    return qs;
  }

  nodesUsing({ parent = null, children = null, varname = "" }) {
    let qs = "nodes";

    if(parent) {
      qs += `: {
        "childrenOf": ${this.escape(parent)}
      }`;
    } else if(children) {
      qs += `: {
        "parentsOf": ${this.escape(children)}
      }`;
    }

    qs += ` | parameterVars | findInValues: {
      "$regex": ${this.escape(`{{\\s*${this.escape(varname).slice(1, -1)}(\\..*?)?\\s*}}`)}
    }`;

    return qs;
  }

  bulkUpdateReference({ node_ids = [], old_varname = "", new_varname = "" }) {
    let qs = `
      nodes | find : {
        "id": {
          "$in": ${this.escape(node_ids)}
        }
      } | updateParameters : {
        "*" : {
          "$regex": [
            ${this.escape(`({{\\s*)${this.escape(old_varname).slice(1, -1)}(\\..*?)?(\\s*}})`)},
            ${this.escape(`$1${this.escape(new_varname).slice(1, -1)}$2$3`)},
            "g"
          ]
        }
      }
    `;

    return qs;
  }

  bulkDeleteReference({ node_ids = [], varname = "" }) {
    let qs = `
      nodes | find : {
        "id": {
          "$in": ${this.escape(node_ids)}
        }
      } | updateParameters : {
        "*" : {
          "$regex": [
            ${this.escape(`{{\\s*${this.escape(varname).slice(1, -1)}(\\..*?)?\\s*}}`)},
            ${this.escape("")},
            "g"
          ]
        }
      }
    `;

    return qs;
  }
}
