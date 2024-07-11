import { assert, describe, it } from "vitest";

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

describe("Testing $n/eq/i operators", () => {
  const model = new BaseDiagramModel();
  runtime.set("objects.main_model", model);
  const dql = new DiagramQL(model);
  const diagram1_cell = diagram1.blueprint.diagram;
  model.fromJSON(diagram1_cell);

  it("$eq", () => {
    let res = dql.query(`
      nodes | outputVars | find: {
        "value": {
          "$eq": "maquina"
        }
      }
    `).length;
    assert.equal(res, 1);

    res = dql.query(`
      nodes | outputVars | find: {
        "value": {
          "$eq": "MAQUINA"
        }
      }
    `).length;
    assert.equal(res, 0);
  });

  it("$eqi", () => {
    let res = dql.query(`
      nodes | outputVars | find: {
        "value": {
          "$eqi": "MAQUINA"
        }
      }
    `).length;
    assert.equal(res, 1);

    res = dql.query(`
      nodes | outputVars | find: {
        "value": {
          "$eqi": "MAQUI"
        }
      }
    `).length;
    assert.equal(res, 0);
  });

  it("$neq", () => {
    let res = dql.query(`
      nodes | outputVars | find: {
        "value": {
          "$neq": "maquina"
        }
      }
    `).length;
    assert.equal(res, 6);
  });

  it("$neqi", () => {
    let res = dql.query(`
      nodes | outputVars | find: {
        "value": {
          "$neqi": "MAQUINA"
        }
      }
    `).length;
    assert.equal(res, 6);
  });
});
