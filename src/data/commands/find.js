import { traverse } from "@src/utils/lang/traverse";

import { $eq } from "@src/data/operators/eq";
import { $eqi } from "@src/data/operators/eqi";
import { $neq } from "@src/data/operators/neq";
import { $neqi } from "@src/data/operators/neqi";

import { $contains } from "@src/data/operators/contains";
import { $containsi } from "@src/data/operators/containsi";
import { $ncontains } from "@src/data/operators/ncontains";
import { $ncontainsi } from "@src/data/operators/ncontainsi";

import { $regex } from "@src/data/operators/regex";
import { $regexi } from "@src/data/operators/regexi";
import { $nregex } from "@src/data/operators/nregex";
import { $nregexi } from "@src/data/operators/nregexi";

import { $in } from "@src/data/operators/in";
import { $ini } from "@src/data/operators/ini";
import { $nin } from "@src/data/operators/nin";
import { $nini } from "@src/data/operators/nini";

const evaluate = ({operator, params}) => {
  let res;

  switch (operator) {

    // (NOT) EQUALS (receives anything)
    // The left operator might be anything
    case "$eq":   // case sensitive
      res = $eq(params);
      break;
    case "$eqi":  // case insensitive
      res = $eqi(params);
      break;
    case "$neq":  // case sensitive
      res = $neq(params);
      break;
    case "$neqi": // case insensitive
      res = $neqi(params);
      break;

    // (NOT) CONTAINS (receives a string)
    // The left operator might be an array or a string
    case "$contains":   // case sensitive
      res = $contains(params);
      break;
    case "$containsi":  // case insensitive
      res = $containsi(params);
      break;
    case "$ncontains":  // case sensitive
      res = $ncontains(params);
      break;
    case "$ncontainsi": // case insensitive
      res = $ncontainsi(params);
      break;

    // (NOT) MATCHES REGEX (receives a string that will be passed to RegExp())
    // The left operator must be an array or a string
    case "$regex":
      res = $regex(params);
      break;
    case "$regexi":
      res = $regexi(params);
      break;
    case "$nregex":
      res = $nregex(params);
      break;
    case "$nregexi":
      res = $nregexi(params);
      break;

    // (NOT) IN (receives an array)
    // The left operator must be an array or a string
    case "$in": // case sensitive
      res = $in(params);
      break;
    case "$ini": // case insensitive
      res = $ini(params);
      break;
    case "$nin": // case sensitive
      res = $nin(params);
      break;
    case "$nini": // case insensitive
      res = $nini(params);
      break;

    // TODO: Implement when required

    // CONTAINS ALL (receives an array)
    // The left operator must be an array
    case "$containsAll": // case sensitive
    case "$containsAlli": // case insensitive

    // CONTAINS ANY (receives an array)
    // The left operator must be an array
    case "$containsAny": // case sensitive
    case "$containsAnyi": // case insensitive

    // CONTAINS NONE (receives an array)
    // The left operator must be an array
    case "$containsNone": // case sensitive
    case "$containsNonei": // case insensitive

    // GREATER THAN (OR EQUAL) (receives an int)
    // The left operator must be an int
    case "$gt":
    case "$gte":

    // LOWER THAN (OR EQUAL) (receives an int)
    // The left operator must be an int
    case "$lt":
    case "$lte":

    // (NOT) BETWEEN (receives an array of two values)
    // The left operator must be an int
    case "$between":
    case "$nbetween":

    // Do we need this at all?
    // Evaluate an array of filters, each one with multiple operators, and
    // return all values that match ALL of the filters.
    case "$and":
      // TODO
      break;

    // Evaluate an array of filters, each one with multiple operators, and
    // return all values that match ANY of the filters.
    case "$or":
      // TODO

      /*
      // Iterate the array of objects
      let chunks = params.values.map(filter_conditions => {
        // Each object can contain multiple operators
        return Object.entries(filter_conditions).map(([nestedOperator, nestedValue]) => {
          const copyofRes = clone(res);
          return evaluate({operator: nestedOperator, params: {
            res: copyofRes,
            filter_key: params.filter_key,
            value: nestedValue,
          }});
        });
      });

      res = chunks;
      */
      break;
    default:
      break;
  }

  return res;
}

export const find = ({res, parameters}) => {
  Object.entries(parameters).forEach(([filter_key, filter_conditions]) => {

    Object.entries(filter_conditions).forEach(([operator, value]) => {
      const params = {res, filter_key, value};

      res = evaluate({operator, params});
    });
  });

  return res;
}

export const findInValues = ({res, parameters}) => {
  res = res.map(v => {
    const __node_id = v.__node_id;
    delete v.__node_id;

    return {
      "values": traverse(v).reduce(function (acc, x) {
        if(this.isLeaf) acc.push(x);
        return acc;
      }, []),
      __node_id,
    }
  });

  Object.entries(parameters).forEach(([operator, value]) => {
    const params = {res, filter_key: "values", value};

    res = evaluate({operator, params});
  });

  return res;
}
