import * as diagram1_obj from "../../tests-assets/diagram1.json";
import * as diagram2_obj from "../../tests-assets/diagram2.json";
import * as diagram_group1_obj from "../../tests-assets/diagram_group1.json";

import { DiagramQL } from "@src/data/DiagramQL";
import { shapes } from "@src/components/shapes";
import { Logger } from "@src/core/Logger";
import { Runtime } from "@src/core/Runtime";
import { BaseDiagramModel } from "@src/models/BaseDiagramModel";

const diagram1 = Object.assign({}, diagram1_obj);
const diagram2 = Object.assign({}, diagram2_obj);
const diagram_group1 = Object.assign({}, diagram_group1_obj);

const logger = new Logger();
const runtime = new Runtime();

logger.mute();

runtime.set("objects.shapes", shapes);
runtime.set("objects.logger", logger);


describe("Testing 'find' capabilities", () => {
  const model = new BaseDiagramModel();
  runtime.set("objects.main_model", model);
  const dql = new DiagramQL(model);
  const diagram1_cell = diagram1.blueprint.diagram;
  model.fromJSON(diagram1_cell);

  it("Find by subtype", () => {
    const res = dql.query(`
      nodes | outputVars | find: {
        "subtype": {
          "$eq": "ec2_instance"
        }
      } | count
    `);
    assert.equal(res, 3);
  });

  it("Find by case insensitive name and type / subtype", () => {
    let res = dql.query(`
      nodes | outputVars | find: {
        "type": {
          "$eq": "cloud_object"
        },
        "value": {
          "$eq": "maquina"
        }
      } | count
    `);
    assert.equal(res, 1);

    res = dql.query(`
      nodes | outputVars | find: {
        "subtype": {
          "$eq": "ec2_instance"
        },
        "value": {
          "$eq": "maquina"
        }
      } | count
    `);
    assert.equal(res, 1);
  });

  it("Find by name, type and subtype", () => {
    const res = dql.query(`
      nodes | outputVars | find: {
        "type": {
          "$eq": "cloud_object"
        },
        "subtype": {
          "$eq": "ec2_ebs"
        },
        "value": {
          "$eq": "disco"
        }
      } | count
    `);
    assert.equal(res, 1);
  });
});

describe("Testing 'childrenOf' parameter", () => {
  const model = new BaseDiagramModel();
  runtime.set("objects.main_model", model);
  const dql = new DiagramQL(model);
  const diagram2_cell = diagram2.blueprint.diagram;
  model.fromJSON(diagram2_cell);

  it("find children of Start box, expects 8 children", () => {
    const start = dql.query(`
      nodes | find: {
        "attributes.type": {
          "$eq": "nebulant.rectangle.vertical.executionControl.Start"
        }
      } | first
    `);

    let res = dql.query(`
      nodes : { "childrenOf": ${dql.escape(start.id)} } | count
    `);
    assert.equal(res, 8);
  });

  it("find children of first level boxes, first find_ec2, expects 3 children", () => {
    const find_ec2 = dql.query(`
      nodes | find: {
        "attributes.type": {
          "$eq": "nebulant.rectangle.vertical.aws.FindInstance"
        }
      } | first
    `);

    let res = dql.query(`
      nodes : { "childrenOf": ${dql.escape(find_ec2.id)} } | count
    `);
    assert.equal(res, 3);
  });

  it("find children of first level boxes, create_ec2, expects 3 children", () => {
    const create_ec2 = dql.query(`
      nodes | find: {
        "attributes.type": {
          "$eq": "nebulant.rectangle.vertical.aws.RunInstance"
        }
      } | first
    `);

    let res = dql.query(`
      nodes : { "childrenOf": ${dql.escape(create_ec2.id)} } | count
    `);
    assert.equal(res, 3);
  });

  it("find children of second level boxes, create_ebs, expects 2 children", () => {
    const create_ebs = dql.query(`
      nodes | find: {
        "attributes.type": {
          "$eq": "nebulant.rectangle.vertical.aws.CreateVolume"
        }
      } | first
    `);

    let res = dql.query(`
      nodes : { "childrenOf": ${dql.escape(create_ebs.id)} } | count
    `);
    assert.equal(res, 2);
  });

  it("find children of second level boxes, find_ebs, expects 2 children", () => {
    const find_ebs = dql.query(`
      nodes | find: {
        "attributes.type": {
          "$eq": "nebulant.rectangle.vertical.aws.FindVolume"
        }
      } | first
    `);

    let res = dql.query(`
      nodes : { "childrenOf": ${dql.escape(find_ebs.id)} } | count
    `);
    assert.equal(res, 2);
  });

  it("find children of third level boxes, attach_ebs, expects 0 children", () => {
    const attach_ebs = dql.query(`
      nodes | find: {
        "attributes.type": {
          "$eq": "nebulant.rectangle.vertical.aws.AttachVolume"
        }
      } | first
    `);

    let res = dql.query(`
      nodes : { "childrenOf": ${dql.escape(attach_ebs.id)} } | count
    `);
    assert.equal(res, 0);
  });

  it("find children of third level boxes, join_threads, expects 0 children", () => {
    const join_threads = dql.query(`
      nodes | find: {
        "attributes.type": {
          "$eq": "nebulant.rectangle.vertical.executionControl.JoinThreads"
        }
      } | first
    `);

    let res = dql.query(`
      nodes : { "childrenOf": ${dql.escape(join_threads.id)} } | count
    `);
    assert.equal(res, 0);
  });

  it("find children of third level boxes, detach_volume, expects 0 children", () => {
    const detach_volume = dql.query(`
      nodes | find: {
        "attributes.type": {
          "$eq": "nebulant.rectangle.vertical.aws.DetachVolume"
        }
      } | first
    `);

    let res = dql.query(`
      nodes : { "childrenOf": ${dql.escape(detach_volume.id)} } | count
    `);
    assert.equal(res, 0);
  });
});

describe("Testing 'childrenOf' parameter in diagram with groups", () => {
  const model = new BaseDiagramModel();
  runtime.set("objects.main_model", model);
  const dql = new DiagramQL(model);
  const diagram_group1_cell = diagram_group1.blueprint.diagram;
  const cm = model.commandManager;
  runtime.set("objects.commandManager", cm);
  model.fromJSON(diagram_group1_cell);

  it("find children of Start box, expects 11 children", () => {
    const start = dql.query(`
      nodes | find: {
        "attributes.type": {
          "$eq": "nebulant.rectangle.vertical.executionControl.Start"
        }
      } | first
    `);
    let res = dql.query(`
      nodes : { "childrenOf": ${dql.escape(start.id)} } | count
    `);
    assert.equal(res, 11);
  });

  it("find children of first Log box, expects 10 children", () => {
    const first_log = dql.query(`
      nodes | find: {
        "attributes.type": {
          "$eq": "nebulant.rectangle.vertical.generic.Log"
        }
      } | first
    `);
    let res = dql.query(`
      nodes : { "childrenOf": ${dql.escape(first_log.id)} } | count
    `);
    assert.equal(res, 10);
  });

  it("find children of start box inside the group, expects 6 children", () => {
    const start_group = dql.query(`
      nodes | find: {
        "attributes.type": {
          "$eq": "nebulant.rectangle.vertical.executionControl.Start"
        }
      }
    `)[1];
    let res = dql.query(`
      nodes : { "childrenOf": ${dql.escape(start_group.id)} } | count
    `);
    assert.equal(res, 6);
  });

  it("find children of log box inside the group, expects 5 children", () => {
    const log_group = dql.query(`
      nodes | find: {
        "attributes.type": {
          "$eq": "nebulant.rectangle.vertical.generic.Log"
        }
      }
    `)[1];
    let res = dql.query(`
      nodes : { "childrenOf": ${dql.escape(log_group.id)} } | count
    `);
    assert.equal(res, 5);
  });

  it("find children of end box inside the group, expects 2 children", () => {
    const end_group = dql.query(`
      nodes | find: {
        "attributes.type": {
          "$eq": "nebulant.rectangle.vertical.executionControl.End"
        }
      }
    `)[0];
    let res = dql.query(`
      nodes : { "childrenOf": ${dql.escape(end_group.id)} } | count
    `);
    assert.equal(res, 2);
  });
});

describe("Testing 'parentsOf' parameter", () => {
  const model = new BaseDiagramModel();
  runtime.set("objects.main_model", model);
  const dql = new DiagramQL(model);
  const diagram2_cell = diagram2.blueprint.diagram;
  model.fromJSON(diagram2_cell);

  it("find parents of Start box, expects no parents", () => {
    const start = dql.query(`
      nodes | find: {
        "attributes.type": {
          "$eq": "nebulant.rectangle.vertical.executionControl.Start"
        }
      } | first
    `);

    let res = dql.query(`
      nodes : { "parentsOf": ${dql.escape(start.id)} } | count
    `);
    assert.equal(res, 0);
  });

  it("find parents of first level boxes, first find_ec2, expects 1 parent", () => {
    const find_ec2 = dql.query(`
      nodes | find: {
        "attributes.type": {
          "$eq": "nebulant.rectangle.vertical.aws.FindInstance"
        }
      } | first
    `);

    let res = dql.query(`
      nodes : { "parentsOf": ${dql.escape(find_ec2.id)} } | count
    `);
    assert.equal(res, 1);
  });

  it("find parents of first level boxes, create_ec2, expects 1 parent", () => {
    const create_ec2 = dql.query(`
      nodes | find: {
        "attributes.type": {
          "$eq": "nebulant.rectangle.vertical.aws.RunInstance"
        }
      } | first
    `);

    let res = dql.query(`
      nodes : { "parentsOf": ${dql.escape(create_ec2.id)} } | count
    `);
    assert.equal(res, 1);
  });

  it("find parents of second level boxes, create_ebs, expects 3 parents", () => {
    const create_ebs = dql.query(`
      nodes | find: {
        "attributes.type": {
          "$eq": "nebulant.rectangle.vertical.aws.CreateVolume"
        }
      } | first
    `);

    let res = dql.query(`
      nodes : { "parentsOf": ${dql.escape(create_ebs.id)} } | count
    `);
    assert.equal(res, 3);
  });

  it("find parents of second level boxes, find_ebs, expects 2 parents", () => {
    const find_ebs = dql.query(`
      nodes | find: {
        "attributes.type": {
          "$eq": "nebulant.rectangle.vertical.aws.FindVolume"
        }
      } | first
    `);

    let res = dql.query(`
      nodes : { "parentsOf": ${dql.escape(find_ebs.id)} } | count
    `);
    assert.equal(res, 2);
  });

  it("find parents of third level boxes, attach_ebs, expects 3 parents", () => {
    const attach_ebs = dql.query(`
      nodes | find: {
        "attributes.type": {
          "$eq": "nebulant.rectangle.vertical.aws.AttachVolume"
        }
      } | first
    `);

    let res = dql.query(`
      nodes : { "parentsOf": ${dql.escape(attach_ebs.id)} } | count
    `);
    assert.equal(res, 4);
  });

  it("find parents of third level boxes, join_threads, expects 3 parents", () => {
    const join_threads = dql.query(`
      nodes | find: {
        "attributes.type": {
          "$eq": "nebulant.rectangle.vertical.executionControl.JoinThreads"
        }
      } | first
    `);

    let res = dql.query(`
      nodes : { "parentsOf": ${dql.escape(join_threads.id)} } | count
    `);
    assert.equal(res, 6);
  });

  it("find parents of third level boxes, detach_volume, expects 3 parents", () => {
    const detach_volume = dql.query(`
      nodes | find: {
        "attributes.type": {
          "$eq": "nebulant.rectangle.vertical.aws.DetachVolume"
        }
      } | first
    `);

    let res = dql.query(`
      nodes : { "parentsOf": ${dql.escape(detach_volume.id)} } | count
    `);
    assert.equal(res, 3);
  });
});

describe("Testing 'parentsOf' parameter in diagram with groups", () => {
  const model = new BaseDiagramModel();
  runtime.set("objects.main_model", model);
  const dql = new DiagramQL(model);
  const diagram_group1_cell = diagram_group1.blueprint.diagram;
  const cm = model.commandManager;
  runtime.set("objects.commandManager", cm);
  model.fromJSON(diagram_group1_cell);

  it("find parents of Start box, expects 0 parents", () => {
    const start = dql.query(`
      nodes | find: {
        "attributes.type": {
          "$eq": "nebulant.rectangle.vertical.executionControl.Start"
        }
      } | first
    `);
    let res = dql.query(`
      nodes : { "parentsOf": ${dql.escape(start.id)} } | count
    `);
    assert.equal(res, 0);
  });

  it("find parents of first Log box, expects 1 parents", () => {
    const first_log = dql.query(`
      nodes | find: {
        "attributes.type": {
          "$eq": "nebulant.rectangle.vertical.generic.Log"
        }
      } | first
    `);
    let res = dql.query(`
      nodes : { "parentsOf": ${dql.escape(first_log.id)} } | count
    `);
    assert.equal(res, 1);
  });

  it("find parents of start box inside the group, expects 6 parents", () => {
    const start_group = dql.query(`
      nodes | find: {
        "attributes.type": {
          "$eq": "nebulant.rectangle.vertical.executionControl.Start"
        }
      }
    `)[1];
    let res = dql.query(`
      nodes : { "parentsOf": ${dql.escape(start_group.id)} } | count
    `);
    assert.equal(res, 6);
  });

  it("find parents of download box inside the group, expects 8 parents", () => {
    const download_files = dql.query(`
      nodes | find: {
        "attributes.type": {
          "$eq": "nebulant.rectangle.vertical.generic.DownloadFiles"
        }
      }
    `)[0];
    let res = dql.query(`
      nodes : { "parentsOf": ${dql.escape(download_files.id)} } | count
    `);
    assert.equal(res, 8);
  });

  it("find parents of end box inside the group, expects 10 parents", () => {
    const end_box = dql.query(`
      nodes | find: {
        "attributes.type": {
          "$eq": "nebulant.rectangle.vertical.executionControl.End"
        }
      }
    `)[0];
    let res = dql.query(`
      nodes : { "parentsOf": ${dql.escape(end_box.id)} } | count
    `);
    assert.equal(res, 10);
  });

  it("find parents of last Log box (after the group), expects 11 parents", () => {
    const last_log = dql.query(`
      nodes | find: {
        "attributes.type": {
          "$eq": "nebulant.rectangle.vertical.generic.Log"
        }
      } | last
    `);
    let res = dql.query(`
      nodes : { "parentsOf": ${dql.escape(last_log.id)} } | count
    `);
    assert.equal(res, 11);
  });
});
