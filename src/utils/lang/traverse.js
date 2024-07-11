import { util } from "@joint/core";
import {
  isSymbol,
  isDate,
  isError,
  isRegExp,
} from "lodash-es";

const reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
const reIsPlainProp = /^\w*$/;

const charCodeOfDot = '.'.charCodeAt(0);
const reEscapeChar = /\\(\\)?/g;
const rePropName = RegExp(
  // Match anything that isn't a dot or bracket.
  '[^.[\\]]+' + '|' +
// Or match property names within brackets.
'\\[(?:' +
  // Match a non-string expression.
  '([^"\'][^[]*)' + '|' +
  // Or match strings (supports escaping characters).
  '(["\'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2' +
')\\]'+ '|' +
// Or match "" as the space between consecutive dots or empty brackets.
'(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))'
  , 'g');

const stringToPath = (string) => {
  const result = [];
  if (string.charCodeAt(0) === charCodeOfDot) {
    result.push('');
  }
  string.replace(rePropName, (match, expression, quote, subString) => {
    let key = match;
    if (quote) {
      key = subString.replace(reEscapeChar, '$1');
    }
    else if (expression) {
      key = expression.trim();
    }
    result.push(key);
  })
  return result;
}

const isKey = (value, object) => {
  if (Array.isArray(value)) {
    return false;
  }
  const type = typeof value;
  if (type === 'number' || type === 'boolean' || value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || (
    object != null &&
    value in Object(object)
  );
}

const castPath = (value, object) => {
  if (Array.isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(value);
}

export const traverse = (obj) => new Traverse(obj);

class Traverse {
  constructor(obj) {
    this.value = obj;
  }

  get(ps) {
    var i = 0;
    var node = this.value;
    ps = castPath(ps, node);
    for (i = 0; i < ps.length; i ++) {
      const key = ps[i];
      if (!node || !Object.hasOwnProperty.call(node, key)) {
        node = undefined;
        break;
      }
      node = node[key];
    }
    return node;
  };

  has(ps) {
    var i = 0;
    var node = this.value;
    ps = castPath(ps, node);
    for (i = 0; i < ps.length; i ++) {
      const key = ps[i];
      if (!node || !Object.hasOwnProperty.call(node, key)) {
        return false;
      }
      node = node[key];
    }
    return true;
  };

  set(ps, value) {
    var i = 0;
    var node = this.value;
    ps = castPath(ps, node);
    for (i = 0; i < ps.length - 1; i ++) {
      const key = ps[i];
      if (!Object.hasOwnProperty.call(node, key)) node[key] = {};
      node = node[key];
    }
    node[ps[i]] = value;
    return value;
  };

  delete(ps) {
    var i = 0;
    var node = this.value;
    ps = castPath(ps, node);
    for (i = 0; i < ps.length - 1; i ++) {
      const key = ps[i];
      if (!node || !Object.hasOwnProperty.call(node, key)) {
        return false;
      }
      node = node[key];
    }
    delete node[ps[i]];
    return true;
  };

  remove(ps) {
    var i = 0;
    var node = this.value;
    ps = castPath(ps, node);
    for (i = 0; i < ps.length - 1; i ++) {
      const key = ps[i];
      if (!node || !Object.hasOwnProperty.call(node, key)) {
        return false;
      }
      node = node[key];
    }

    if(Array.isArray(node)) {
      node.splice(ps[i], 1);
    } else {
      delete node[ps[i]];
      return true;
    }
  };

  map(cb) {
    return walk(this.value, cb, true);
  };

  forEach(cb) {
    this.value = walk(this.value, cb, false);
    return this.value;
  };

  reduce(cb, init) {
    var skip = arguments.length === 1;
    var acc = skip ? this.value : init;
    this.forEach(function (x) {
      if (!this.isRoot || !skip) {
        acc = cb.call(this, acc, x);
      }
    });
    return acc;
  };

  paths() {
    var acc = [];
    this.forEach(function (x) {
      acc.push(this.path);
    });
    return acc;
  };

  nodes() {
    var acc = [];
    this.forEach(function (x) {
      acc.push(this.node);
    });
    return acc;
  };

  clone() {
    var parents = [], nodes = [];

    return (function clone (src) {
      for (let i = 0; i < parents.length; i++) {
        if (parents[i] === src) {
          return nodes[i];
        }
      }

      if (typeof src === 'object' && src !== null) {
        const dst = copy(src);

        parents.push(src);
        nodes.push(dst);

        forEach(Object.keys(src), function (key) {
          dst[key] = clone(src[key]);
        });

        parents.pop();
        nodes.pop();
        return dst;
      }
      else {
        return src;
      }
    })(this.value);
  };
}

function walk (root, cb, immutable) {
  var path = [];
  var parents = [];
  var alive = true;

  return (function walker (node_) {
    var node = immutable ? copy(node_) : node_;
    var modifiers = {};

    var keepGoing = true;

    var state = {
      node : node,
      node_ : node_,
      path : [].concat(path),
      parent : parents[parents.length - 1],
      parents : parents,
      key : path.slice(-1)[0],
      isRoot : path.length === 0,
      level : path.length,
      circular : null,
      update : function (x, stopHere) {
        if (!state.isRoot) {
          state.parent.node[state.key] = x;
        }
        state.node = x;
        if (stopHere) keepGoing = false;
      },
      'delete' : function (stopHere) {
        delete state.parent.node[state.key];
        if (stopHere) keepGoing = false;
      },
      remove : function (stopHere) {
        if (Array.isArray(state.parent.node)) {
          state.parent.node.splice(state.key, 1);
        }
        else {
          delete state.parent.node[state.key];
        }
        if (stopHere) keepGoing = false;
      },
      keys : null,
      before : function (f) { modifiers.before = f },
      after : function (f) { modifiers.after = f },
      pre : function (f) { modifiers.pre = f },
      post : function (f) { modifiers.post = f },
      stop : function () { alive = false },
      block : function () { keepGoing = false }
    };

    if (!alive) return state;

    function updateState() {
      if (typeof state.node === 'object' && state.node !== null) {
        if (!state.keys || state.node_ !== state.node) {
          state.keys = Object.keys(state.node)
        }

        state.isLeaf = state.keys.length == 0;

        for (let i = 0; i < parents.length; i++) {
          if (parents[i].node_ === node_) {
            state.circular = parents[i];
            break;
          }
        }
      }
      else {
        state.isLeaf = true;
        state.keys = null;
      }

      state.notLeaf = !state.isLeaf;
      state.notRoot = !state.isRoot;
    }

    updateState();

    // use return values to update if defined
    var ret = cb.call(state, state.node);
    if (ret !== undefined && state.update) state.update(ret);

    if (modifiers.before) modifiers.before.call(state, state.node);

    if (!keepGoing) return state;

    if (typeof state.node == 'object'
      && state.node !== null && !state.circular
    ) {
      parents.push(state);

      updateState();

      forEach(state.keys, function (key, i) {
        path.push(key);

        if (modifiers.pre) modifiers.pre.call(state, state.node[key], key);
        var child = walker(state.node ? state.node[key] : state.node);
        if (immutable &&
          typeof state.node === 'object' &&
          state.node !== null &&
          Object.hasOwnProperty.call(state.node, key)
        ) {
          state.node[key] = child.node;
        }

        child.isLast = i == state.keys.length - 1;
        child.isFirst = i == 0;

        if (modifiers.post) modifiers.post.call(state, child);

        path.pop();
      });
      parents.pop();
    }

    if (modifiers.after) modifiers.after.call(state, state.node);

    return state;
  })(root).node;
}

function copy (src) {
  var dst;
  if (typeof src === 'object' && src !== null) {

    if (Array.isArray(src)) {
      dst = [];
    }
    else if (Buffer.isBuffer(src)) {
      dst = Buffer.from(src);
    }
    else if (isDate(src)) {
      dst = new Date(src.getTime ? src.getTime() : src);
    }
    else if (isRegExp(src)) {
      dst = new RegExp(src);
    }
    else if (isError(src)) {
      dst = { message: src.message };
    }
    else if (util.isBoolean(src)) {
      dst = new Boolean(src);
    }
    else if (util.isNumber(src)) {
      dst = new Number(src);
    }
    else if (util.isString(src)) {
      dst = new String(src);
    }
    else if (Object.create && Object.getPrototypeOf) {
      dst = Object.create(Object.getPrototypeOf(src));
    }
    else if (src.constructor === Object) {
      dst = {};
    }
    else {
      const proto =
        (src.constructor && src.constructor.prototype)
        || src.__proto__
        || {}
      ;
      const T = function () {};
      T.prototype = proto;
      dst = new T;
    }

    forEach(Object.keys(src), function (key) {
      dst[key] = src[key];
    });
    return dst;
  }
  else return src;
}

var forEach = function (xs, fn) {
  if (xs.forEach) return xs.forEach(fn)
  else for (let i = 0; i < xs.length; i++) {
    fn(xs[i], i, xs);
  }
};
