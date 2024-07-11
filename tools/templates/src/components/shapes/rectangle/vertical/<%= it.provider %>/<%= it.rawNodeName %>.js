import { util } from "@joint/core";

import { <%= it.nodeConnectionsType %> } from "./<%= it.nodeConnectionsType %>";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  <%= it.rawNodeName %>Static, <%= it.rawNodeName %>Fns
} from "@src/components/implementations/<%= it.provider %>/<%= it.rawNodeName %>";

export class <%= it.rawNodeName %> extends <%= it.nodeConnectionsType %> {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.<%= it.provider %>.<%= it.rawNodeName %>",
      ...<%= it.rawNodeName %>Static,
    });
  }
}
extendFns(<%= it.rawNodeName %>, <%= it.rawNodeName %>Fns);
