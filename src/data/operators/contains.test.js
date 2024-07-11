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


describe("Testing $n/contains/i operators", () => {
  const model = new BaseDiagramModel();
  runtime.set("objects.main_model", model);
  const dql = new DiagramQL(model);
  const diagram2_cell = diagram2.blueprint.diagram;
  model.fromJSON(diagram2_cell);

  it("$contains", () => {
    let res = dql.query(`
      nodes | outputVars | find: {
        "capabilities": {
          "$contains": "ssh"
        }
      }
    `).length;
    assert.equal(res, 3);

    res = dql.query(`
      nodes | outputVars | find: {
        "provider": {
          "$contains": "aws"
        }
      }
    `).length;
    assert.equal(res, 5);

    res = dql.query(`
      nodes | outputVars | find: {
        "subtype": {
          "$contains": "ec2_ebs"
        }
      }
    `).length;
    assert.equal(res, 2);
  });

  it("$containsi", () => {
    let res = dql.query(`
      nodes | outputVars | find: {
        "capabilities": {
          "$containsi": "SSH"
        }
      }
    `).length;
    assert.equal(res, 3);

    res = dql.query(`
      nodes | outputVars | find: {
        "provider": {
          "$containsi": "Aws"
        }
      }
    `).length;
    assert.equal(res, 5);

    res = dql.query(`
      nodes | outputVars | find: {
        "subtype": {
          "$containsi": "ec2_EBS"
        }
      }
    `).length;
    assert.equal(res, 2);
  });

  it("$ncontains", () => {
    let res = dql.query(`
      nodes | outputVars | find: {
        "capabilities": {
          "$ncontains": "ssh"
        }
      }
    `).length;
    assert.equal(res, 2);

    res = dql.query(`
      nodes | outputVars | find: {
        "provider": {
          "$ncontains": "aws"
        }
      }
    `).length;
    assert.equal(res, 0);

    res = dql.query(`
      nodes | outputVars | find: {
        "subtype": {
          "$ncontains": "ec2_ebs"
        }
      }
    `).length;
    assert.equal(res, 3);
  });

  it("$ncontainsi", () => {
    let res = dql.query(`
      nodes | outputVars | find: {
        "capabilities": {
          "$ncontainsi": "SSH"
        }
      }
    `).length;
    assert.equal(res, 2);

    res = dql.query(`
      nodes | outputVars | find: {
        "provider": {
          "$ncontainsi": "AWS"
        }
      }
    `).length;
    assert.equal(res, 0);

    res = dql.query(`
      nodes | outputVars | find: {
        "subtype": {
          "$ncontainsi": "ec2_EBS"
        }
      }
    `).length;
    assert.equal(res, 3);
  });
});
