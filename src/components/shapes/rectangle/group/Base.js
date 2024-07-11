import { dia } from "@joint/core";
import { BaseStatic, BaseFns, BaseStaticExtra } from "@src/components/implementations/group/Base";

export const Base = dia.Element.define(
  "nebulant.components.implementations.group.Base",
  BaseStatic, // overrides default attributes
  BaseFns, // prototype properties
  BaseStaticExtra, // static properties
);
