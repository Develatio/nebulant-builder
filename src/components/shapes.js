// Don't touch anything in here... it's for your own good...
import { dia, shapes as jshapes } from "@joint/core"

import { Group } from "./shapes/rectangle/group/Group";

import { Rect } from "@src/components/shapes/rectangle/vertical/base/Rect";
import { OneInOneOut } from "@src/components/shapes/rectangle/vertical/base/OneInOneOut";
import { OneInTwoOut } from "@src/components/shapes/rectangle/vertical/base/OneInTwoOut";
import { OneInZeroOut } from "@src/components/shapes/rectangle/vertical/base/OneInZeroOut";

import * as aws from "@src/components/shapes/rectangle/vertical/aws/*";
import * as generic from "@src/components/shapes/rectangle/vertical/generic/*";
import * as hetznerCloud from "@src/components/shapes/rectangle/vertical/hetznerCloud/*";
import * as executionControl from "@src/components/shapes/rectangle/vertical/executionControl/*";

import { OneInThreeOut } from "@src/components/shapes/threepstar/vertical/base/OneInThreeOut";
import * as executionControlThreepstar from "@src/components/shapes/threepstar/vertical/executionControl/executionControl";

import * as link from "@src/components/link/*";

export const shapes = {
  dia: dia,
  basic: jshapes.basic,
  standard: jshapes.standard,
  nebulant: {
    rectangle: {
      group: {
        Group,
      },
      vertical: {
        base: {
          Rect,
          OneInOneOut,
          OneInTwoOut,
          OneInZeroOut,
        },
        aws,
        generic,
        hetznerCloud,
        executionControl,
      },
    },
    threepstar: {
      vertical: {
        base: {
          OneInThreeOut,
        },
        executionControl: executionControlThreepstar,
      }
    },
    link,
  },
};
