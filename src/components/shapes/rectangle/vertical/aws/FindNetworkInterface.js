import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  FindNetworkInterfaceStatic, FindNetworkInterfaceFns,
  FindNetworkInterfacesStatic
} from "@src/components/implementations/aws/FindNetworkInterface";

export class FindNetworkInterface extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.aws.FindNetworkInterface",
      ...FindNetworkInterfaceStatic,
    });
  }
}
extendFns(FindNetworkInterface, FindNetworkInterfaceFns);

export class FindNetworkInterfaces extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.aws.FindNetworkInterfaces",
      ...FindNetworkInterfacesStatic,
    });
  }
}
extendFns(FindNetworkInterfaces, FindNetworkInterfaceFns);
