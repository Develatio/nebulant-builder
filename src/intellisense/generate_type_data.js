const fs = require("fs");
const path = require("path");
const espree = require("espree");
const esquery = require("esquery");

function walkPathSync(currentDirPath, callback) {
  var fs = require('fs');
  var path = require('path');
  fs.readdirSync(currentDirPath).forEach(function (name) {
    var filePath = path.join(currentDirPath, name);
    var stat = fs.statSync(filePath);
    if(stat.isFile()) {
      callback(filePath, stat);
    } else if(stat.isDirectory()) {
      walkPathSync(filePath, callback);
    }
  });
}

class ASTParser {
  constructor() {
    this.ast = null;
    this.code = null;
  }

  parse(code, opts = {}) {
    this.code = code;
    this.ast = espree.parse(this.code, Object.assign({}, opts, {
      sourceType: "module",
      ecmaVersion: 15,
    }));
  }

  query(selector) {
    return esquery(this.ast, selector);
  }
}

const data = {
  providers: [],
  types: [
    { label: "user_variable", value: "generic:user_variable" },
  ],
  capabilities: [],
};

const BASEDIR = "/code/src/components/implementations";
fs.readdirSync(BASEDIR).forEach(f => {
  const dirpath = path.join(BASEDIR, f);

  if(!fs.statSync(dirpath).isDirectory()) return;

  walkPathSync(dirpath, (fpath, _stat) => {
    if(!fpath.endsWith(".js") && !fpath.endsWith(".jsx")) return;

    const parser = new ASTParser();
    let code = fs.readFileSync(fpath).toString();
    try {
      parser.parse(code);
    } catch (error) {
      console.log(`Error while parsing ${fpath}`);
      console.log(error);
    }

    // "provider" and "type" keys can be located in the "outputs -> result" object of each validator
    let properties = parser.query(`[key.name=outputs] [key.name=result] [key.name=type] CallExpression`);
    if(properties) {
      const node = properties.find(node => node.callee.property?.name == "default");
      const typev = node?.arguments?.[0]?.value;
      if(typev) {
        if(!data.types.find(o => o.value === typev)) {
          console.log(`Adding "${typev}" to the list of types`);
          data.types.push({ label: typev.split(":")[1], value: typev });
        }

        const [provider] = typev.split(":");
        if(!data.providers.find(o => o.value === provider)) {
          console.log(`Adding "${provider}" to the list of providers`);
          data.providers.push({ label: provider, value: provider });
        }
      }
    }

    properties = parser.query(`[key.name=capabilities] CallExpression`);
    if(properties) {
      const capv = properties.find(node => node.callee.property?.name == "default");
      if(capv) {
        capv.arguments[0].elements.forEach(n => {
          if(!data.capabilities.find(o => o.value === n.value)) {
            data.capabilities.push({ label: n.value, value: n.value });
          }
        });
      }
    }
  });
});

fs.writeFileSync(path.join(__dirname, "providers_types_capabilities.json"), JSON.stringify(data));
