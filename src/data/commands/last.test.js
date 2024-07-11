import * as diagram1_obj from "../../tests-assets/diagram1.json";
import * as diagram2_obj from "../../tests-assets/diagram2.json";
import * as diagram_empty_obj from "../../tests-assets/diagram_empty.json";

import { DiagramQL } from "@src/data/DiagramQL";
import { shapes } from "@src/components/shapes";
import { Logger } from "@src/core/Logger";
import { Runtime } from "@src/core/Runtime";
import { BaseDiagramModel } from "@src/models/BaseDiagramModel";

const diagram1 = Object.assign({}, diagram1_obj);
const diagram2 = Object.assign({}, diagram2_obj);
const diagram_empty = Object.assign({}, diagram_empty_obj);

const logger = new Logger();
const runtime = new Runtime();

logger.mute();

runtime.set("objects.shapes", shapes);
runtime.set("objects.logger", logger);


describe("Testing 'last' command in a normal diagram", () => {
  const model = new BaseDiagramModel();
  runtime.set("objects.main_model", model);
  const dql = new DiagramQL(model);
  const diagram1_cell = diagram1.blueprint.diagram;
  model.fromJSON(diagram1_cell);

  it("nodes, ec2_instance, last", () => {
    let res = dql.query(`
      nodes | outputVars | find: {"subtype": {"$contains": "ec2_instance"}} | last
    `);
    assert.equal(res.value, "maquina3");
  });

  it("nodes, ec2_ebs, last", () => {
    let res = dql.query(`
      nodes | outputVars | find: {"subtype": {"$contains": "ec2_ebs"}} | last
    `);
    assert.equal(res.value, "disco2");
  });
});

describe("Testing 'last' command in an only Start box diagram", () => {
  const model = new BaseDiagramModel();
  runtime.set("objects.main_model", model);
  const dql = new DiagramQL(model);
  const diagram_empty_cell = diagram_empty.blueprint.diagram;
  model.fromJSON(diagram_empty_cell);

  it("nodes last", () => {
    let res = dql.query(`
      nodes | last
    `);
    assert.equal(res.prop('data').settings.parameters.name, "Group");
  });

  it("DQL undefined, last returning null", () => {
    let res = dql.query(`
      nodes  | find: { "type": "non-existant" } | last
    `);
    assert.equal(res, null);
  });
});

