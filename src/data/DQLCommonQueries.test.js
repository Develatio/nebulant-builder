import * as diagram2_obj from "../tests-assets/diagram2_vars_for_dropdown.json";
import * as diagram3_obj from "../tests-assets/diagram3.json";

import { DiagramQL } from "@src/data/DiagramQL";
import { shapes } from "@src/components/shapes";
import { Logger } from "@src/core/Logger";
import { Runtime } from "@src/core/Runtime";
import { BaseDiagramModel } from "@src/models/BaseDiagramModel";

const diagram2 = Object.assign({}, diagram2_obj);
const diagram3 = Object.assign({}, diagram3_obj);

const logger = new Logger();
const runtime = new Runtime();

logger.mute();

runtime.set("objects.shapes", shapes);
runtime.set("objects.logger", logger);


describe("Testing vars_for_dropdown", () => {
  const model = new BaseDiagramModel();
  runtime.set("objects.main_model", model);
  const dql = new DiagramQL(model);
  const diagram2_cell = diagram2.blueprint.diagram;
  model.fromJSON(diagram2_cell);

  it("vars_for_dropdown, node call", () => {
    let node = dql.query("nodes")[0]
    let res = dql.vars_for_dropdown({node: node});
    let res_dql = dql.query(res);
    assert.equal(res_dql, []);
  });

  it("vars_for_dropdown, provider call", () => {
    let res = dql.vars_for_dropdown({ provider: "aws"});
    let res_dql = dql.query(res);
    let expected = [
      {type: "DiagramQL", label: "{{ AWS_EC2.__id }}", value: "{{AWS_EC2.__id}}"},
      {type: "DiagramQL", label: "{{ AWS_EC2_1.__id }}", value: "{{AWS_EC2_1.__id}}"},
      {type: "DiagramQL", label: "{{ AWS_EC2_2.__id }}", value: "{{AWS_EC2_2.__id}}"},
      {type: "DiagramQL", label: "{{ AWS_EBS.__id }}", value: "{{AWS_EBS.__id}}"},
      {type: "DiagramQL", label: "{{ AWS_EBS_1.__id }}", value: "{{AWS_EBS_1.__id}}"}
    ]
    assert.equal(res_dql, expected);
  });

  it("vars_for_dropdown, provider array call, 2 providers, expects data of both", () => {
    let res = dql.vars_for_dropdown({
      provider: [
        {
          type: "provider",
          value: "aws",
          provider: "aws"
        },
        {
          type: "provider",
          value: "generic",
          provider: "generic"
        },
      ]
    });
    let res_dql = dql.query(res);
    let expected = [
      {type: "DiagramQL", label: "{{ AWS_EC2.__id }}", value: "{{AWS_EC2.__id}}"},
      {type: "DiagramQL", label: "{{ AWS_EC2_1.__id }}", value: "{{AWS_EC2_1.__id}}"},
      {type: "DiagramQL", label: "{{ AWS_EC2_2.__id }}", value: "{{AWS_EC2_2.__id}}"},
      {type: "DiagramQL", label: "{{ GENERIC_VAR2 }}", value: "{{GENERIC_VAR2}}"},
      {type: "DiagramQL", label: "{{ GENERIC_VAR1 }}", value: "{{GENERIC_VAR1}}"},
      {type: "DiagramQL", label: "{{ AWS_EBS.__id }}", value: "{{AWS_EBS.__id}}"},
      {type: "DiagramQL", label: "{{ AWS_EBS_1.__id }}", value: "{{AWS_EBS_1.__id}}"},
      {type: "DiagramQL", label: "{{ HTTP-Response }}", value: "{{HTTP-Response}}"}
    ]
    assert.equal(res_dql, expected);
  });

  it("vars_for_dropdown, provider array call, nonexistent provider + generic, expects generic data", () => {
    let res = dql.vars_for_dropdown({
      provider: [
        {
          type: "provider",
          value: "non-existent",
          provider: "non-existent"
        },
        {
          type: "provider",
          value: "generic",
          provider: "generic"
        },
      ]
    });
    let res_dql = dql.query(res);
    let expected = [
      {type: "DiagramQL", label: "{{ GENERIC_VAR2 }}", value: "{{GENERIC_VAR2}}"},
      {type: "DiagramQL", label: "{{ GENERIC_VAR1 }}", value: "{{GENERIC_VAR1}}"},
      {type: "DiagramQL", label: "{{ HTTP-Response }}", value: "{{HTTP-Response}}"}
    ]
    assert.equal(res_dql, expected);
  });

  it("vars_for_dropdown, provider array call, nonexistent providers, expects []", () => {
    let res = dql.vars_for_dropdown({
      provider: [
        {
          type: "provider",
          value: "non-existent1",
          provider: "non-existent1"
        },
        {
          type: "provider",
          value: "non-existent2",
          provider: "non-existent2"
        },
      ]
    });
    let res_dql = dql.query(res);
    let expected = [];
    assert.equal(res_dql, expected);
  });

  it("vars_for_dropdown, provider + type call", () => {
    let res = dql.vars_for_dropdown({ provider: "aws", type: "cloud_object"});
    let res_dql = dql.query(res);
    let expected = [
      {type: "DiagramQL", label: "{{ AWS_EC2.__id }}", value: "{{AWS_EC2.__id}}"},
      {type: "DiagramQL", label: "{{ AWS_EC2_1.__id }}", value: "{{AWS_EC2_1.__id}}"},
      {type: "DiagramQL", label: "{{ AWS_EC2_2.__id }}", value: "{{AWS_EC2_2.__id}}"},
      {type: "DiagramQL", label: "{{ AWS_EBS.__id }}", value: "{{AWS_EBS.__id}}"},
      {type: "DiagramQL", label: "{{ AWS_EBS_1.__id }}", value: "{{AWS_EBS_1.__id}}"}
    ]
    assert.equal(res_dql, expected);
  });

  it("vars_for_dropdown, provider array + type array call, (generic + user variable, expects data)", () => {
    let res = dql.vars_for_dropdown({
      provider: [
        {
          type: "provider",
          value: "generic",
          provider: "generic"
        },
      ],
      type: [
        {
          type: "type",
          value: "user variable",
          provider: "generic"
        },
      ],
    });
    let res_dql = dql.query(res);
    let expected = [
      {type: "DiagramQL", label: "{{ GENERIC_VAR2 }}", value: "{{GENERIC_VAR2}}"},
      {type: "DiagramQL", label: "{{ GENERIC_VAR1 }}", value: "{{GENERIC_VAR1}}"},
    ]
    assert.equal(res_dql, expected);
  });

  it("vars_for_dropdown, provider array + type array call (generic + cloud_object, expects [])", () => {
    let res = dql.vars_for_dropdown({
      provider: [
        {
          type: "provider",
          value: "generic",
          provider: "generic"
        },
      ],
      type: [
        {
          type: "type",
          value: "cloud_object",
          provider: "generic"
        },
      ],
    });
    let res_dql = dql.query(res);
    let expected = [];
    assert.equal(res_dql, expected);
  });

  it("vars_for_dropdown, provider array + type array call (nonexistent type, expects [])", () => {
    let res = dql.vars_for_dropdown({
      provider: [
        {
          type: "provider",
          value: "generic",
          provider: "generic"
        },
      ],
      type: [
        {
          type: "type",
          value: "non-existent",
          provider: "generic"
        },
      ],
    });
    let res_dql = dql.query(res);
    let expected = [];
    assert.equal(res_dql, expected);
  });

  it("vars_for_dropdown, provider + type + subtype callm nonexistent subtype", () => {
    let res = dql.vars_for_dropdown({ provider: "aws", type: "cloud_object", subtype: "non_existent" });
    let res_dql = dql.query(res);
    let expected = [];
    assert.equal(res_dql, expected);
  });

  it("vars_for_dropdown, provider + type + subtype call", () => {
    let res = dql.vars_for_dropdown({ provider: "aws", type: "cloud_object", subtype: "ec2_ebs" });
    let res_dql = dql.query(res);
    let expected = [
      {"type":"DiagramQL","label":"{{ AWS_EBS.__id }}","value":"{{AWS_EBS.__id}}"},
      {"type":"DiagramQL","label":"{{ AWS_EBS_1.__id }}","value":"{{AWS_EBS_1.__id}}"}
    ]
    assert.equal(res_dql, expected);
  });

  it("vars_for_dropdown, provider array + type + subtype array call, (aws + cloud_object + ec2_ebs, expects data)", () => {
    let res = dql.vars_for_dropdown({
      provider: [
        {
          type: "provider",
          value: "aws",
          provider: "aws"
        },
      ],
      type: [
        {
          type: "type",
          value: "cloud_object",
          provider: "aws"
        },
      ],
      subtype: [
        {
          type: "subtype",
          value: "ec2_ebs",
          provider: "aws"
        },
      ],
    });
    let res_dql = dql.query(res);
    let expected = [
      {"type":"DiagramQL","label":"{{ AWS_EBS.__id }}","value":"{{AWS_EBS.__id}}"},
      {"type":"DiagramQL","label":"{{ AWS_EBS_1.__id }}","value":"{{AWS_EBS_1.__id}}"}
    ]
    assert.equal(res_dql, expected);
  });

  it("vars_for_dropdown, provider array + type + subtype array call, (aws + cloud_object + ec2_instance, expects data)", () => {
    let res = dql.vars_for_dropdown({
      provider: [
        {
          type: "provider",
          value: "aws",
          provider: "aws"
        },
      ],
      type: [
        {
          type: "type",
          value: "cloud_object",
          provider: "aws"
        },
      ],
      subtype: [
        {
          type: "subtype",
          value: "ec2_instance",
          provider: "aws"
        },
      ],
    });
    let res_dql = dql.query(res);
    let expected = [
      {type: "DiagramQL", label: "{{ AWS_EC2.__id }}", value: "{{AWS_EC2.__id}}"},
      {type: "DiagramQL", label: "{{ AWS_EC2_1.__id }}", value: "{{AWS_EC2_1.__id}}"},
      {type: "DiagramQL", label: "{{ AWS_EC2_2.__id }}", value: "{{AWS_EC2_2.__id}}"},
    ]
    assert.equal(res_dql, expected);
  });

  it("vars_for_dropdown, provider array + type + nonexistent subtype array call, (aws + cloud_object + ec2_instance, expects [])", () => {
    let res = dql.vars_for_dropdown({
      provider: [
        {
          type: "provider",
          value: "aws",
          provider: "aws"
        },
      ],
      type: [
        {
          type: "type",
          value: "cloud_object",
          provider: "aws"
        },
      ],
      subtype: [
        {
          type: "subtype",
          value: "non-existent",
          provider: "aws"
        },
      ],
    });
    let res_dql = dql.query(res);
    let expected = [];
    assert.equal(res_dql, expected);
  });
});


describe("Testing nodesUsing", () => {
  const model = new BaseDiagramModel();
  runtime.set("objects.main_model", model);
  const dql = new DiagramQL(model);
  const diagram2_cell = diagram2.blueprint.diagram;
  model.fromJSON(diagram2_cell);

  it("nodesUsing, simple call, no params, expects []", () => {
    let res = dql.nodesUsing({});
    let res_dql = dql.query(res);
    let expected = []
    assert.equal(res_dql, expected);
  });

  it("nodesUsing, start box + empty varname, expects []", () => {
    let start_box = dql.query(`nodes | find: {"attributes.type": {"$eq": "nebulant.rectangle.vertical.executionControl.Start"}} | first`)
    let res = dql.nodesUsing({ parent: start_box.id, varname: "" });
    let res_dql = dql.query(res);
    let expected = []
    assert.equal(res_dql, expected);
  });

  it("nodesUsing, start box + unexistent varname, expects []", () => {
    let start_box = dql.query(`nodes | find: {"attributes.type": {"$eq": "nebulant.rectangle.vertical.executionControl.Start"}} | first`)
    let res = dql.nodesUsing({ parent: start_box.id, varname: "non-existent" });
    let res_dql = dql.query(res);
    let expected = []
    assert.equal(res_dql, expected);
  });

  it("nodesUsing, start box + existing varname but not in Start, expects data", () => {
    let start_box = dql.query(`nodes | find: {"attributes.type": {"$eq": "nebulant.rectangle.vertical.executionControl.Start"}} | first`)
    let res = dql.nodesUsing({ parent: start_box.id, varname: "GENERIC_VAR1" });
    let res_dql = dql.query(res);
    let expected = [{values: ["{{GENERIC_VAR1}}"], __node_id: "f045f1fc-8608-4238-8ae7-d249612ccfa1"}];
    assert.equal(res_dql, expected);
  });

  it("nodesUsing, box with variables + empty varname, expects []", () => {
    let vars_box = dql.query(`nodes | find: {"attributes.type": {"$eq": "nebulant.rectangle.vertical.generic.DefineVariables"}} | first`)
    let res = dql.nodesUsing({ parent: vars_box.id, varname: "" });
    let res_dql = dql.query(res);
    let expected = []
    assert.equal(res_dql, expected);
  });

  it("nodesUsing, box with variables + unexisting varname, expects []", () => {
    let vars_box = dql.query(`nodes | find: {"attributes.type": {"$eq": "nebulant.rectangle.vertical.generic.DefineVariables"}} | first`)
    let res = dql.nodesUsing({ parent: vars_box.id, varname: "non-existent" });
    let res_dql = dql.query(res);
    let expected = []
    assert.equal(res_dql, expected);
  });

  it("nodesUsing, box with variables + varname but not in this box, expects []", () => {
    let vars_box = dql.query(`nodes | find: {"attributes.type": {"$eq": "nebulant.rectangle.vertical.generic.DefineVariables"}} | first`)
    let res = dql.nodesUsing({ parent: vars_box.id, varname: "AWS_EBS" });
    let res_dql = dql.query(res);
    let expected = []
    assert.equal(res_dql, expected);
  });

  it("nodesUsing, box with variables + varname in this box, but using children instead of parent, expects []", () => {
    let vars_box = dql.query(`nodes | find: {"attributes.type": {"$eq": "nebulant.rectangle.vertical.generic.DefineVariables"}} | first`)
    let res = dql.nodesUsing({ children: vars_box.id, varname: "GENERIC_VAR1" });
    let res_dql = dql.query(res);
    let expected = []
    assert.equal(res_dql, expected);
  });

  it("nodesUsing, box with variables + varname in this box, using parent, expects data", () => {
    let vars_box = dql.query(`nodes | find: {"attributes.type": {"$eq": "nebulant.rectangle.vertical.generic.DefineVariables"}} | first`)
    let res = dql.nodesUsing({ parent: vars_box.id, varname: "GENERIC_VAR1" });
    let res_dql = dql.query(res);
    let expected = [{values: ["{{GENERIC_VAR1}}"], __node_id: "f045f1fc-8608-4238-8ae7-d249612ccfa1"}];
    assert.equal(res_dql, expected);
  });
});

describe("Testing nodesUsing, with groups", () => {
  const model = new BaseDiagramModel();
  runtime.set("objects.main_model", model);
  const dql = new DiagramQL(model);
  const diagram3_cell = diagram3.blueprint.diagram;
  model.fromJSON(diagram3_cell);

  it("nodesUsing, varname before group being used inside and outside the group, expects data (2)", () => {
    let vars_box = dql.query(`nodes | find: {"attributes.type": {"$eq": "nebulant.rectangle.vertical.aws.FindVolume"}} | first`)
    let res = dql.nodesUsing({ parent: vars_box.id, varname: "AWS_EBS_1" });
    let res_dql = dql.query(res);
    let expected = 2;
    assert.equal(res_dql.length, expected);
  });

  it("nodesUsing, varname before group not being used in parents, expects []", () => {
    let vars_box = dql.query(`nodes | find: {"attributes.type": {"$eq": "nebulant.rectangle.vertical.aws.FindVolume"}} | first`)
    let res = dql.nodesUsing({ children: vars_box.id, varname: "AWS_EBS_1" });
    let res_dql = dql.query(res);
    let expected = [];
    assert.equal(res_dql, expected);
  });

  it("nodesUsing, varname inside group being used inside and outside the group, expects data (2)", () => {
    let vars_box = dql.query(`nodes | find: {"attributes.type": {"$eq": "nebulant.rectangle.vertical.generic.DefineVariables"}}`)[1]
    let res = dql.nodesUsing({ parent: vars_box.id, varname: "GENERIC_VAR_INSIDE_GROUP1" });
    let res_dql = dql.query(res);
    let expected = 2;
    assert.equal(res_dql.length, expected);
  });

  it("nodesUsing, varname inside group being used before the group, expects data (1)", () => {
    let vars_box = dql.query(`nodes | find: {"attributes.type": {"$eq": "nebulant.rectangle.vertical.generic.DefineVariables"}}`)[1]
    let res = dql.nodesUsing({ children: vars_box.id, varname: "GENERIC_VAR_INSIDE_GROUP1" });
    let res_dql = dql.query(res);
    let expected = 1;
    assert.equal(res_dql.length, expected);
  });

  it("nodesUsing, varname inside group NOT being used before the group, expects []", () => {
    let vars_box = dql.query(`nodes | find: {"attributes.type": {"$eq": "nebulant.rectangle.vertical.generic.DefineVariables"}}`)[1]
    let res = dql.nodesUsing({ children: vars_box.id, varname: "GENERIC_VAR_INSIDE_GROUP2" });
    let res_dql = dql.query(res);
    let expected = [];
    assert.equal(res_dql, expected);
  });

  it("nodesUsing, varname after group being used inside the group, expects data (1)", () => {
    let vars_box = dql.query(`nodes | find: {"attributes.type": {"$eq": "nebulant.rectangle.vertical.generic.DefineVariables"}}`)[2]
    let res = dql.nodesUsing({ children: vars_box.id, varname: "GENERIC_VAR_OUTSIDE_GROUP2" });
    let res_dql = dql.query(res);
    let expected = 1;
    assert.equal(res_dql.length, expected);
  });

  it("nodesUsing, varname after group being used inside and before the group, expects data (1)", () => {
    let vars_box = dql.query(`nodes | find: {"attributes.type": {"$eq": "nebulant.rectangle.vertical.generic.DefineVariables"}}`)[2]
    let res = dql.nodesUsing({ children: vars_box.id, varname: "GENERIC_VAR_OUTSIDE_GROUP1" });
    let res_dql = dql.query(res);
    let expected = 1;
    assert.equal(res_dql.length, expected);
  });

  it("nodesUsing, varname after group being used after the group, expects data (1)", () => {
    let vars_box = dql.query(`nodes | find: {"attributes.type": {"$eq": "nebulant.rectangle.vertical.generic.DefineVariables"}}`)[2]
    let res = dql.nodesUsing({ parent: vars_box.id, varname: "GENERIC_VAR_OUTSIDE_GROUP1" });
    let res_dql = dql.query(res);
    let expected = 1;
    assert.equal(res_dql.length, expected);
  });
});

describe("Testing bulkActions, with groups", () => {
  const model = new BaseDiagramModel();
  runtime.set("objects.main_model", model);
  const dql = new DiagramQL(model);
  const diagram3_cell = diagram3.blueprint.diagram;
  model.fromJSON(diagram3_cell);

  it("bulkUpdateReference, query a box that is not using the variable, expects no effect", () => {
    let start_box = dql.query(`nodes | find: {"attributes.type": {"$eq": "nebulant.rectangle.vertical.executionControl.Start"}} | first`)
    let res = dql.bulkUpdateReference({ node_ids: start_box.id, old_varname: "AWS_EBS_1", new_varname:"NEW_VAR" });
    let res_dql = dql.query(res);
    Object.values(start_box.prop('data').settings.parameters).forEach( val => {
        assert.notEqual(val, "NEW_VAR");
    });
  });

    it("bulkUpdateReference, query a box that sets the variable, expects no effect", () => {
      let create_ebs = dql.query(`nodes | find: {"attributes.type": {"$eq": "nebulant.rectangle.vertical.aws.CreateVolume"}} | first`)
      let res = dql.bulkUpdateReference({ node_ids: create_ebs.id, old_varname: "AWS_EBS", new_varname:"NEW_VAR" });
      let res_dql = dql.query(res);
      assert.equal(create_ebs.prop('data').settings.outputs.result.value, "AWS_EBS");
    });

    it("bulkUpdateReference, query a box that uses the variable, expects a variable change", () => {
      let log_box = dql.query(`nodes | find: {"attributes.type": {"$eq": "nebulant.rectangle.vertical.generic.Log"}}`)[1];
      let res = dql.bulkUpdateReference({ node_ids: log_box.id, old_varname: "AWS_EBS", new_varname:"NEW_VAR" });
      let res_dql = dql.query(res);
      assert.equal(log_box.prop('data').settings.parameters.content, "{{NEW_VAR}}");
    });

    it("bulkDeleteReference, query a box that is not using the variable, expects no effect", () => {
      let start_box = dql.query(`nodes | find: {"attributes.type": {"$eq": "nebulant.rectangle.vertical.executionControl.Start"}} | first`)
      let res = dql.bulkDeleteReference({ node_ids: start_box.id, varname: "AWS_EBS" });
      let res_dql = dql.query(res);
      assert.equal(Object.keys(start_box.prop('data').settings.parameters).length, 7);
    });

      it("bulkDeleteReference, query a box that sets the variable, expects no effect", () => {
        let create_ebs = dql.query(`nodes | find: {"attributes.type": {"$eq": "nebulant.rectangle.vertical.aws.CreateVolume"}} | first`)
        let res = dql.bulkDeleteReference({ node_ids: create_ebs.id, varname: "AWS_EBS" });
        let res_dql = dql.query(res);
        assert.equal(create_ebs.prop('data').settings.outputs.result.value, "AWS_EBS");
      });

      it("bulkDeleteReference, query a box that uses the variable, expects a variable deletion", () => {
        let log_box = dql.query(`nodes | find: {"attributes.type": {"$eq": "nebulant.rectangle.vertical.generic.Log"}}`)[0];
        let res = dql.bulkDeleteReference({ node_ids: log_box.id, varname: "GENERIC_VAR1" });
        let res_dql = dql.query(res);
        assert.notEqual(log_box.prop('data').settings.parameters.content, "{{GENERIC_VAR1}}");
        assert.equal(log_box.prop('data').settings.parameters.content, "");
      });
});
