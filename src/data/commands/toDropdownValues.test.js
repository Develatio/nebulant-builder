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


describe("Testing 'toDropdownValues' command", () => {
  const model = new BaseDiagramModel();
  runtime.set("objects.main_model", model);
  const dql = new DiagramQL(model);
  const diagram2_cell = diagram2.blueprint.diagram;
  model.fromJSON(diagram2_cell);

  it("transforms outputVars into dropdown values", () => {
    const res = dql.query(`
      nodes | outputVars | find: {
        "subtype": {
          "$eq": "ec2_ebs"
        }
      } | toDropdownValues`);
    assert.equal(res.length, 2);
    assert.deepEqual(res, [
      {type: "DiagramQL", label: "{{ AWS_EBS.__id }}", value: "{{AWS_EBS.__id}}"},
      {type: "DiagramQL", label: "{{ AWS_EBS_1.__id }}", value: "{{AWS_EBS_1.__id}}"},
    ]);
  });
});
