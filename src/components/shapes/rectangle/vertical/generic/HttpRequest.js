import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import { HttpRequestStatic, HttpRequestFns } from "@src/components/implementations/generic/HttpRequest";

export class HttpRequest extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.generic.HttpRequest",
      ...HttpRequestStatic,
    });
  }
}
extendFns(HttpRequest, HttpRequestFns);
