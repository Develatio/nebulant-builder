import * as diagram1_obj from "../../tests-assets/diagram1.json";
import * as diagram2_obj from "../../tests-assets/diagram2.json";
import * as diagram_empty_obj from "../../tests-assets/diagram_empty.json";
import * as diagram_update1_obj from "../../tests-assets/diagram_updateparameters1.json";
import * as diagram_update2_obj from "../../tests-assets/diagram_updateparameters2.json";

import { DiagramQL } from "@src/data/DiagramQL";
import { shapes } from "@src/components/shapes";
import { Logger } from "@src/core/Logger";
import { Runtime } from "@src/core/Runtime";
import { BaseDiagramModel } from "@src/models/BaseDiagramModel";

const diagram1 = Object.assign({}, diagram1_obj);
const diagram2 = Object.assign({}, diagram2_obj);
const diagram_empty = Object.assign({}, diagram_empty_obj);
const diagram_update1 = Object.assign({}, diagram_update1_obj);
const diagram_update2 = Object.assign({}, diagram_update2_obj);

const logger = new Logger();
const runtime = new Runtime();

logger.mute();

runtime.set("objects.shapes", shapes);
runtime.set("objects.logger", logger);


describe("Testing 'updateParameters' command in a normal diagram", () => {
  const model = new BaseDiagramModel();
  runtime.set("objects.main_model", model);
  const dql = new DiagramQL(model);
  const diagram1_cell = diagram1.blueprint.diagram;
  model.fromJSON(diagram1_cell);

  it("updateParameters, change _VolumeName from disco to DISK", () => {
    let create_ebs = dql.query(`nodes | find: {"attributes.type": {"$eq": "nebulant.rectangle.vertical.aws.CreateVolume"}} | first`)
    // Ensure it's "disco"
    assert.equal(create_ebs.prop('data').settings.parameters._VolumeName, "disco");
    // Change the value "disco" to "DISK" in every variable (*)
    let create_ebs_modified = dql.query(`
      nodes | find: {
        "id": {
          "$eq": ${dql.escape(create_ebs.id)}
        }
      } | updateParameters: {"*": {"$regex": ["disco", "DISK", "g"]}} | first
    `);
    // Ensure it's "DISK"
    assert.equal(create_ebs.prop('data').settings.parameters._VolumeName, "DISK");
  });

  it("updateParameters, use an existing replace_key (not *), expects the change to be done", () => {
    let create_ebs = dql.query(`nodes | find: {"attributes.type": {"$eq": "nebulant.rectangle.vertical.aws.CreateVolume"}} | first`)
    // Ensure it's still "DISK" as we changed it before
    assert.equal(create_ebs.prop('data').settings.parameters.VolumeType[0], "gp2");
    // Change value in VolumeType specifically from "gp2" to "GP3"
    let create_ebs_modified = dql.query(`
      nodes | find: {
        "id": {
          "$eq": ${dql.escape(create_ebs.id)}
        }
      } | updateParameters: {"VolumeType[0]": {"$regex": ["gp2", "GP3", "g"]}} | first
    `);
    // Ensure it's "disco"
    assert.equal(create_ebs.prop('data').settings.parameters.VolumeType[0], "GP3");
  });

  it("updateParameters, use a non-existing replace_key, expects to do nothing", () => {
    let create_ebs = dql.query(`nodes | find: {"attributes.type": {"$eq": "nebulant.rectangle.vertical.aws.CreateVolume"}} | first`)
    // Try to change value in non-existant variable obv. It should not change anything
    let create_ebs_modified = dql.query(`
      nodes | find: {
        "id": {
          "$eq": ${dql.escape(create_ebs.id)}
        }
      } | updateParameters: {"non-existant-variable": {"$regex": ["disco", "DISK", "g"]}} | first
    `);
    // Ensure there are no changes tween create_ebs and create_ebs_modified
    assert.equal(create_ebs.prop('data'), create_ebs_modified.prop('data'));
  });

  it("updateParameters, use '$value' replacer", () => {
    let create_ebs = dql.query(`nodes | find: {"attributes.type": {"$eq": "nebulant.rectangle.vertical.aws.CreateVolume"}} | first`)
    // Try to change somethging with $value replacer. It should not change anything
    let create_ebs_modified = dql.query(`
      nodes | find: {
        "id": {
          "$eq": ${dql.escape(create_ebs.id)}
        }
      } | updateParameters: {"_VolumeName": {"$value": ["DISK", "disco", "g"]}} | first
    `);
    // Ensure there are no changes tween create_ebs and create_ebs_modified
    assert.equal(create_ebs.prop('data'), create_ebs_modified.prop('data'));
  });

  it("updateParameters, use '$replace' replacer", () => {
    let create_ebs = dql.query(`nodes | find: {"attributes.type": {"$eq": "nebulant.rectangle.vertical.aws.CreateVolume"}} | first`)
    // Try to change somethging with $replace replacer. It should not change anything
    let create_ebs_modified = dql.query(`
      nodes | find: {
        "id": {
          "$eq": ${dql.escape(create_ebs.id)}
        }
      } | updateParameters: {"_VolumeName": {"$replace": ["DISK", "disco", "g"]}} | first
    `);
    // Ensure there are no changes tween create_ebs and create_ebs_modified
    assert.equal(create_ebs.prop('data'), create_ebs_modified.prop('data'));
  });

  it("updateParameters, use an unexistant '$whatever' replacer", () => {
    let create_ebs = dql.query(`nodes | find: {"attributes.type": {"$eq": "nebulant.rectangle.vertical.aws.CreateVolume"}} | first`)
    // Try to change somethging with $whatever replacer. It should not change anything
    let create_ebs_modified = dql.query(`
      nodes | find: {
        "id": {
          "$eq": ${dql.escape(create_ebs.id)}
        }
      } | updateParameters: {"_VolumeName": {"$whatever": ["DISK", "disco", "g"]}} | first
    `);
    // Ensure there are no changes tween create_ebs and create_ebs_modified
    assert.equal(create_ebs.prop('data'), create_ebs_modified.prop('data'));
  });
});

describe("Testing 'updateParameters' command in an only Start box diagram", () => {
  const model = new BaseDiagramModel();
  runtime.set("objects.main_model", model);
  const dql = new DiagramQL(model);
  const diagram_empty_cell = diagram_empty.blueprint.diagram;
  model.fromJSON(diagram_empty_cell);

  it("updateParameters, replace name=Group in an only Start box diagram", () => {
    let start_box = dql.query(`nodes | find: {"attributes.type": {"$eq": "nebulant.rectangle.vertical.executionControl.Start"}} | first`)
    const res = dql.query(`nodes | find : { "id" : { "$eq": ${dql.escape(start_box.id)} } } | updateParameters: { "name" : {"$regex": ["Group", "SOMETHING", "g"]}} | first`);
    assert.equal(start_box.prop('data').settings.parameters.name, "SOMETHING");
  });
});

describe("Testing 'updateParameters' command in a double branch diagram", () => {
  const model = new BaseDiagramModel();
  runtime.set("objects.main_model", model);
  const dql = new DiagramQL(model);
  const diagram_update1_cell = diagram_update1.blueprint.diagram;
  model.fromJSON(diagram_update1_cell);

  it("updateParameters, replace all the AWS_SERVER variables", () => {
    const res = dql.query(`nodes | updateParameters: { "*" : {"$regex": ["AWS_SERVER", "SOMETHING", "g"]}} | first`);
    const logs = dql.query(`nodes | find: { "attributes.type": { "$eq" : "nebulant.rectangle.vertical.generic.Log" } }`);
    logs.forEach(function(node) {
      assert.equal(node.prop('data').settings.parameters.content, "El server es {{ SOMETHING }}");
    });
  });
});

describe("Testing 'updateParameters' command in a group diagram", () => {
  const model = new BaseDiagramModel();
  runtime.set("objects.main_model", model);
  const dql = new DiagramQL(model);
  const diagram_update2_cell = diagram_update2.blueprint.diagram;
  model.fromJSON(diagram_update2_cell);

  it("updateParameters, replace all the AWS_SERVER variables", () => {
    const res = dql.query(`nodes | updateParameters: { "*" : {"$regex": ["AWS_SERVER", "SOMETHING", "g"]}} | first`);
    const logs = dql.query(`nodes | find: { "attributes.type": { "$eq" : "nebulant.rectangle.vertical.generic.Log" } }`);
    logs.forEach(function(node) {
      assert.equal(node.prop('data').settings.parameters.content, "El server es {{ SOMETHING }}");
    });
  });
});
