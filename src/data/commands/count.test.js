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


describe("Testing 'count' command", () => {
  const model = new BaseDiagramModel();
  runtime.set("objects.main_model", model);
  const dql = new DiagramQL(model);
  const diagram1_cell = diagram1.blueprint.diagram;
  model.fromJSON(diagram1_cell);

  it("nodes count", () => {
    let res = dql.query(`
      nodes | count
    `);
    assert.equal(res, 8);
  });

  it("parameterVars count", () => {
    let res = dql.query(`
      nodes | parameterVars | count
    `);
    assert.equal(res, 8);
  });

  it("outputVars count", () => {
    let res = dql.query(`
      nodes | outputVars | count
    `);
    assert.equal(res, 7);
  });
});

