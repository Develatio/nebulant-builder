// Who needs an LSP server anyways¿?

import { getCaretCoordinates } from "@src/utils/textarea-caret";
import { Logger } from "@src/core/Logger";
import { Runtime } from "@src/core/Runtime";
import { EventBus } from "@src/core/EventBus";
import { DiagramQL } from "@src/data/DiagramQL";

const RE_ARR_ACCESS = /^(\w+)\[\d+\]$/;
const check_if_accessing_array = (word) => {
  if(RE_ARR_ACCESS.test(word)) {
    word = word.match(RE_ARR_ACCESS)[1];
    return [true, word];
  } else {
    return [false, word];
  }
}

const SPECIAL_VARS = ["runtime"];
const is_special = (word) => SPECIAL_VARS.includes(word.toLowerCase());

export class BaseIntellisense {
  static predict = ({ node }) => {
    return new Promise((resolve, reject) => {
      const logger = new Logger();
      const runtime = new Runtime();

      const inputElement = document.activeElement;
      const cursorPosition = inputElement.selectionStart;
      const value = inputElement.value;

      logger.debug("Intellisense kick-in.");

      // Don't waste CPU cycles
      if(cursorPosition < 1) {
        logger.debug("Intellisense aborting, bad cursor position.");
        reject();
        return;
      }

      // Check if we're between "{{" and "}}"
      let found_leading_brackets = -1;
      for(let i = cursorPosition; i >= 1; i--) {
        if(value[i] === "{" && value[i-1] === "{") {
          found_leading_brackets = i + 1;
          break;
        }
      }
      if(found_leading_brackets === -1) {
        logger.debug("Intellisense aborting, cursor not inside curly braces.");
        reject();
        return;
      }

      let found_trailing_brackets = -1;
      for(let i = cursorPosition; i < value.length - 1; i++) {
        if(value[i] === "}" && value[i+1] === "}") {
          found_trailing_brackets = i;
          break;
        }
      }
      if(found_trailing_brackets === -1) {
        logger.debug("Intellisense aborting, cursor not inside curly braces.");
        reject();
        return;
      }

      // Find if the cursor is at the end
      for(let i = cursorPosition; i < found_trailing_brackets; i++) {
        if(value[i] !== "}" && value[i] !== " ") {
          logger.debug("Intellisense aborting, cursor not at the end of text inside curly braces.");
          reject();
          return;
        }
      }

      // Find if there are no spaces in the string
      let s = value.substring(found_leading_brackets, found_trailing_brackets);
      s = s.trim();
      if(s.indexOf(" ") > -1) {
        logger.debug("Intellisense aborting, space found inside the predicate.");
        reject();
        return;
      }

      // Find if there are no ".", in which case it means that we must close the predictor
      if(s.indexOf(".") === -1) {
        logger.debug("Intellisense aborting, dot not found.");
        reject();
        return;
      }

      // Okey, we need to autocomplete "s"

      // Get an array of words
      const words_chain = s.split(".");

      // Check if the last element is an array accessor, and if so, abort
      let [sw, _] = check_if_accessing_array(words_chain[words_chain.length - 1]);
      if(sw) {
        logger.debug("Intellisense aborting, trying to access an array as object.");
        reject();
        return;
      }

      // Remove the last element, which would be the "." at the end of the chain
      if(words_chain[words_chain.length - 1] === "") {
        words_chain.pop();
      }

      // Get the first element which will be the name of the output var
      let ovname = words_chain.shift();
      let accessing_array;
      [accessing_array, ovname] = check_if_accessing_array(ovname);

      // Check if "ovname" is a special var, like "OS". If it is, then we can skip
      // the DQL call.
      let type, isArray;
      if(is_special(ovname)) {
        type = `generic:ovname`;
      } else {
        const dql = new DiagramQL();
        // Search for the last output var named <ovname> in the parents of this node
        const outputVar = dql.query(`nodes: {
          "parentsOf": ${dql.escape(node.id)}
        } | outputVars | find: {
          "value": {
            "$eq": ${dql.escape(ovname)}
          }
        } | last`);
        if(!outputVar) {
          logger.debug("Intellisense aborting, no parent node found.");
          reject();
          return;
        }

        ({ type, isArray } = outputVar);
      }

      // The "outputVar" is an array, but "ovname" isn't being accessed as an array
      if(isArray && !accessing_array) {
        logger.debug("Intellisense aborting, trying to access an array as object.");
        reject();
        return;
      }

      // The "outputVar isn't an array, but "ovname" is being accessed as an array
      if(!isArray && accessing_array) {
        logger.debug("Intellisense aborting, trying to access an object as an array.");
        reject();
        return;
      }

      // Get the predictions hashmap
      const builderAssets = runtime.get("objects.builderAssets");
      const [_provider, _type] = type.split(":");
      builderAssets.get({
        asset_id: `${_provider}/intellisense/${_type}`,
      }).then(predictions => {
        // The imported json will have the following structure:
        //
        // [
        //   { key: "name", type: "string", children: [], },
        //   {
        //     key: "tags",
        //     type: "array",
        //     children: [
        //       { key: "foo", type: "string", children: [], }
        //     ]
        //   },
        //   {
        //     key: "ifaces",
        //     type: "object",
        //     children: [
        //       { key: "public", type: "string", children: [], },
        //       { key: "private", type: "string", children: [], }
        //     ]
        //   }
        // ]
        //
        while(words_chain.length > 0) {
          let word = words_chain.shift();

          // Check if the word contains an array accessor ("[x]"), and if so, get only
          // the word itself
          [accessing_array, word] = check_if_accessing_array(word);

          if(predictions.map(p => p.key).includes(word)) {
            const obj = predictions.find(p => p.key == word);
            if(obj.type === "array") {
              predictions = accessing_array ? obj.children : [];
            } else {
              predictions = accessing_array ? [] : obj.children;
            }
          } else {
            if(words_chain.length == 0) {
              // filter by <word>
              predictions = predictions.filter(p => p.key.includes(word));
            }
          }
        }

        const eventBus = new EventBus();

        const rect = inputElement.getClientRects();
        const coords = getCaretCoordinates(inputElement, inputElement.selectionEnd);

        const top = rect[0].top + coords.top - coords.height;
        const left = rect[0].left + coords.left;

        if(predictions.length === 0) {
          logger.debug("Intellisense aborting, no available predictions.");
          reject();
          return;
        }

        logger.debug("Intellisense completed, showing found predictions.");

        eventBus.publish("TriggerIntellisense", {
          element: inputElement,
          predictions,
          coords: {top, left},
          promiseHandlers: {resolve, reject},
        });
      }).catch(() => {
        logger.error(`Error while trying to predict {{ ${s} }} (${type})`);
      });
    });
  }
}
