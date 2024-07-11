import * as diagram1_obj from "../../tests-assets/diagram1.json";
import * as diagram2_obj from "../../tests-assets/diagram2.json";

import { DiagramQL } from "@src/data/DiagramQL";
import { shapes } from "@src/components/shapes";
import { Logger } from "@src/core/Logger";
import { Runtime } from "@src/core/Runtime";
import { BaseDiagramModel } from "@src/models/BaseDiagramModel";

const diagram1 = Object.assign({}, diagram1_obj);
const diagram2 = Object.assign({}, diagram2_obj);

const logger = new Logger();
const runtime = new Runtime();

logger.mute();

runtime.set("objects.shapes", shapes);
runtime.set("objects.logger", logger);


describe("Testing $n/regex/i operators", () => {
  const model = new BaseDiagramModel();
  runtime.set("objects.main_model", model);
  const dql = new DiagramQL(model);
  const diagram2_cell = diagram2.blueprint.diagram;
  model.fromJSON(diagram2_cell);

  it("$regex", () => {
    let res = dql.query(`
      nodes | outputVars | find: {
        "capabilities": {
          "$regex": "^(.*)sh(.*)$"
        }
      }
    `).length;
    assert.equal(res, 3);

    res = dql.query(`
      nodes | outputVars | find: {
        "subtype": {
          "$regex": "ec2_.*"
        }
      }
    `).length;
    assert.equal(res, 5);
  });

  it("$regexi", () => {
    let res = dql.query(`
      nodes | outputVars | find: {
        "capabilities": {
          "$regexi": "^(.*)SH(.*)$"
        }
      }
    `).length;
    assert.equal(res, 3);

    res = dql.query(`
      nodes | outputVars | find: {
        "subtype": {
          "$regexi": "EC2_.*"
        }
      }
    `).length;
    assert.equal(res, 5);
  });

  it("$nregex", () => {
    let res = dql.query(`
      nodes | outputVars | find: {
        "subtype": {
          "$nregex": "^(.*)instance(.*)$"
        }
      }
    `).length;
    assert.equal(res, 2);
  });

  it("$nregexi", () => {
    let res = dql.query(`
      nodes | outputVars | find: {
        "subtype": {
          "$nregexi": "^(.*)Instance(.*)$"
        }
      }
    `).length;
    assert.equal(res, 2);
  });
});
