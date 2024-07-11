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


describe("Testing $n/in/i operators", () => {
  const model = new BaseDiagramModel();
  runtime.set("objects.main_model", model);
  const dql = new DiagramQL(model);
  const diagram2_cell = diagram2.blueprint.diagram;
  model.fromJSON(diagram2_cell);

  it("$in", () => {
    let res = dql.query(`
      nodes | outputVars | find: {
        "capabilities": {
          "$in": ["ssh"]
        }
      }
    `).length;
    assert.equal(res, 3);

    res = dql.query(`
      nodes | outputVars | find: {
        "capabilities": {
          "$in": ["foo", "ssh", "bar"]
        }
      }
    `).length;
    assert.equal(res, 3);

    res = dql.query(`
      nodes | outputVars | find: {
        "provider": {
          "$in": ["foo", "aws"]
        }
      }
    `).length;
    assert.equal(res, 5);
  });

  it("$ini", () => {
    let res = dql.query(`
      nodes | outputVars | find: {
        "capabilities": {
          "$ini": ["SSH"]
        }
      }
    `).length;
    assert.equal(res, 3);

    res = dql.query(`
      nodes | outputVars | find: {
        "capabilities": {
          "$ini": ["Foo", "Run_Script", "bar"]
        }
      }
    `).length;
    assert.equal(res, 0);

    res = dql.query(`
      nodes | outputVars | find: {
        "provider": {
          "$ini": ["foo", "AWS"]
        }
      }
    `).length;
    assert.equal(res, 5);
  });

  it("$nin", () => {
    let res = dql.query(`
      nodes | outputVars | find: {
        "capabilities": {
          "$nin": ["ssh"]
        }
      }
    `).length;
    assert.equal(res, 2);

    res = dql.query(`
      nodes | outputVars | find: {
        "subtype": {
          "$nin": ["foo", "ec2_ebs"]
        }
      }
    `).length;
    assert.equal(res, 3);
  });

  it("$nini", () => {
    let res = dql.query(`
      nodes | outputVars | find: {
        "capabilities": {
          "$nini": ["SSH"]
        }
      }
    `).length;
    assert.equal(res, 2);

    res = dql.query(`
      nodes | outputVars | find: {
        "subtype": {
          "$nini": ["foo", "ec2_EBS"]
        }
      }
    `).length;
    assert.equal(res, 3);
  });
});
