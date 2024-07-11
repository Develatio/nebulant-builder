import { clone } from "@src/utils/lang/clone";

// https://github.com/anotherCoward/textarea-caret-position - 12 Dec 2018

var properties = [
  "direction",
  "boxSizing",
  "width",
  "height",
  "overflowX",
  "overflowY",
  "overflowWrap", // added
  "overflowAnchor", // added
  "borderTopWidth",
  "borderRightWidth",
  "borderBottomWidth",
  "borderLeftWidth",
  "borderStyle",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "fontStyle",
  "fontVariant",
  "fontWeight",
  "fontStretch",
  "fontSize",
  "fontSizeAdjust",
  "fontKerning", // added
  "textRendering", // added
  "lineHeight",
  "fontFamily",
  "textAlign",
  "textTransform",
  "textIndent",
  "textOverflow",
  "textDecoration",
  "textUnderlinePosition", // added
  "letterSpacing",
  "wordSpacing",
  "tabSize",
  "writingMode", // added
  "MozTabSize",
  "textAlignLast", // added
  "-webkit-text-emphasis-style", // wont work correctly as the high gets hardly increased but is required to get the following lines correct
  "-webkit-text-emphasis-position",
  "-webkit-text-security", // password stuff
  "-webkit-font-smoothing",
  "transform", // won't work correctly in most cases, but transform: translate or translate3d could move the element node, try to detect it anyway , requires a lot more calculations for the correct position
];
// i don't wanna check this everywhere... so lets set it once
const getComputedStyle = window.getComputedStyle || function getComputedStyle(e) {
  return e.currentStyle;
}
// Edge has no node.isConnected
const isConnected = function isConnected(el) {
  if(el.isConnected)
    return true;
  if(el.parentNode) {
    let parent = el.parentNode;
    while (parent && parent != document.documentElement) parent = parent.parentNode;
    return parent == document.documentElement;
  }
  return false;
}
let isFirefox = (window.mozInnerScreenX != null);
let isEdge = /Edge|EdgA/.test(navigator.userAgent);

export function getCaretCoordinates(element, position, options) {
  if(!element) {
    return getCaretCoordinates(document.activeElement || document.documentElement, position, options);
  }
  if(!isConnected(element)) {
    return {
      top: 0,
      left: 0,
      height: 0,
      node: element
    }
  }
  if(~["CANVAS", "IFRAME"].indexOf(element.nodeName) || (options && options.checkTabIndex && element.getAttribute("tabindex") != null)) {
    let rect = element.getBoundingClientRect();
    // required as they act different
    return {
      top: rect.top,
      left: rect.left,
      height: rect.height,
      node: element
    }
  }
  if(options && options.absolute) {
    let optionsClone = clone(options);
    optionsClone.absolute = false;
    let relative = getCaretCoordinates(element, position, optionsClone),
      erect = element.getBoundingClientRect();
    return {
      top: erect.top + relative.top,
      left: erect.left + relative.left,
      height: relative.height, // remember kids, drugs are bad
      node: relative.node
    }
  }
  // try to get it automatically
  let special = ~["INPUT", "TEXTAREA"].indexOf(element.nodeName);
  // force it ALWAYS on every element other by getSelection()
  if(position == null || !special) {
    if(special) {
      if(typeof element.selectionStart == "number") {
        // edge doesn't have it on textareas and on input fields its always forward... 'yay'
        let dir = element.selectionDirection;
        if(!dir) {
          if(element.selectionStart >= element.selectionEnd) {
            dir = "backward";
          } else {
            dir = "forward";
          }
        }
        return getCaretCoordinates(element, dir == "forward" ? element.selectionEnd : element.selectionStart, options);
      } else {
        return getCaretCoordinates(element, position || element.value.length, options);
      }
    } else {
      if(window.getSelection().rangeCount) {
        // Don't play around with the user selection
        let sel = window.getSelection(),
          range = sel.getRangeAt(0).cloneRange();
        if(sel.getRangeAt(0).commonAncestorContainer == (sel.extentNode || sel.focusNode).parentNode) {
          // seems like ctrl+a, triple clicks or multiple node selection - not sure how to act, collapse it at the focusNode is the best option
          range.setStart(sel.focusNode, sel.focusOffset);
          range.setEndAfter(range.startContainer);
        }
        range.collapse(
          range.startOffset === sel.focusOffset &&
          range.startContainer == sel.focusNode
        );

        let rect = range.getBoundingClientRect();
        // check for textnodes
        let height = parseInt(range.startContainer.nodeType == 1 ? getComputedStyle(range.startContainer).lineHeight : getComputedStyle(range.startContainer.parentNode).lineHeight);
        // empty div on contenteditable="true"
        let allzero = true;
        for (let i in rect)
          if(rect[i] != 0 && !isNaN(rect[i]))
            allzero = false;
        let modified = false;
        if(allzero && (range.commonAncestorContainer.nodeType == 1 && ~["true", "plaintext-only"].indexOf(range.commonAncestorContainer.getAttribute("contenteditable")) || (range.commonAncestorContainer.innerText != null && range.commonAncestorContainer.innerText.length))) {
          if(~["true", "plaintext-only"].indexOf(range.commonAncestorContainer.getAttribute("contenteditable")) && document.activeElement.firstChild == null) {
            document.activeElement.innerHTML = "<br>";
            range.setStart(document.activeElement.firstChild, 0);
            range.setEnd(range.startContainer, 0);
            modified = true;
          } else {
            // fails if caret is after an empty element
            range.setEndAfter(range.startContainer);
          }
          rect = range.getBoundingClientRect();
          height = parseInt(getComputedStyle(range.startContainer).lineHeight);
          // well contenteditable, pressing "backspace" removes the first inner div containing a <br>, this "breaks" the positiondetection
          if(range.startContainer.firstChild === null) {
            rect = range.startContainer.getBoundingClientRect();
            height = parseInt(getComputedStyle(range.startContainer).lineHeight);
          }
        } else if(allzero) {
          // if clicked on an anonymous block, browsers act different, chrome selects the next sibling while Edge and Firefox select the last char before the anonymous block
          range.setStart(document.activeElement, 0);
          range.setEndAfter(document.activeElement);
          rect = document.activeElement.getBoundingClientRect();
          height = parseInt(getComputedStyle(range.startContainer).lineHeight);
        }
        // chrome 'lineHeight = normal'
        if(isNaN(height)) {
          let node = range.startContainer;
          if(range.startContainer.nodeType != 1) {
            node = node.parentNode;
          }
          let current = node.style.lineHeight;
          node.style.lineHeight = "1em";
          height = parseInt(getComputedStyle(node).lineHeight);
          node.style.lineHeight = current != null ? current : "";
          if(typeof node.getAttribute("style") == "string" && !node.getAttribute("style").length) // clean up if empty
            node.removeAttribute("style");
        }

        let erect = //thihihi
          element.getBoundingClientRect(),
          coordinates = {
            top: rect.top - erect.top,
            left: rect.left - erect.left,
            height: height,
            node: range.startContainer
          };
        if(options && options.withScrolls) {
          if(element.scrollLeft)
            coordinates.left = coordinates.left + element.scrollLeft;
          if(element.scrollHeight)
            coordinates.top = coordinates.top + element.scrollTop;
        }
        if(modified) {
          coordinates.node = document.activeElement;
          document.activeElement.removeChild(document.activeElement.firstChild);

        }
        return coordinates;
      } else {
        return {
          top: 0,
          left: 0,
          height: 0,
          node: element
        }
      }
    }
  }
  let div = document.createElement("div"),
    style = div.style,
    computed = getComputedStyle(element),
    isInput = element.nodeName === "INPUT";
  if(options && options.nextToParent)
    element.parentNode.appendChild(div);
  else
    document.body.appendChild(div);
  if(options && options.applyClass && (typeof options.applyClass == "string" || options.applyClass instanceof String))
    div.className = options.applyClass;
  style.all = "initial";
  style.whiteSpace = "pre-wrap";

  if(!isInput) {
    style.textOverflow = "clip";
    style.wordWrap = "break-word";
  }

  properties.forEach(function(prop) {
    if(isInput && prop === "lineHeight") {
      if(computed.boxSizing === "border-box") {
        const height = parseInt(computed.height);
        const outerHeight =
          parseInt(computed.paddingTop) +
          parseInt(computed.paddingBottom) +
          parseInt(computed.borderTopWidth) +
          parseInt(computed.borderBottomWidth);
        const targetHeight = outerHeight + parseInt(computed.lineHeight);
        if(height > targetHeight) {
          style.lineHeight = height - outerHeight + "px";
        } else if(height === targetHeight) {
          style.lineHeight = computed.lineHeight;
        } else {
          style.lineHeight = 0;
        }
      } else {
        style.lineHeight = computed.lineHeight;
      }
    } else {
      style[prop] = computed[prop];
    }
  });
  // apply AFTER the loop
  style.position = "fixed";
  style.visibility = "hidden";
  // wont affect the size in any way but allows scrolling if required...
  style.overflowY = style.overflowX = style.overflow = "overlay";

  if(isInput)
    style.whiteSpace = "pre"; // makes the replacement obsolete

  let val = "";
  val = element.value;
  if(isInput && element.getAttribute("type") == "password") {
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/password
    // maybe add a check for it...?
    // some use * some • - most browsers use •
    val = val.split("").map(function(_v) {
      return isEdge || isFirefox ? "●" : "•"
    }).join("");
  }
  div.appendChild(document.createTextNode(val.substr(0, position)));

  style.overflowY = style.overflowX = style.overflow = "overlay";

  let span = document.createElement("span");

  // avoid other stylesheets like span { margin: 0 2px; }
  span.style.all = "unset";
  span.style.lineHeight = "1em";

  div.appendChild(span);
  span.appendChild(document.createTextNode(val.substr(position, 1024) || "."));
  if(span.textContent.length == 1)
    span.fontFamily = "monospace";
  let coordinates = {
    top: span.offsetTop + parseInt(computed["borderTopWidth"]),
    left: span.offsetLeft + parseInt(computed["borderLeftWidth"]),
    height: parseInt(getComputedStyle(span).lineHeight),

    node: element
  };
  span.textContent = "";
  if(isEdge && isInput && div.scrollWidth > div.clientWidth) {
    // edge doesn't have scroll values inputs set... screw it... the position is always with scrolling... so absolute will fail too.
    // this stops it at the end of the inputbox if scroll is present
    coordinates.left += element.scrollWidth - div.scrollWidth;
  }
  div.parentNode.removeChild(div);
  // get the caret respective to the scroll positions, even if negative
  if(!options || !options.withScrolls) {
    if(element.scrollLeft)
      coordinates.left = coordinates.left - element.scrollLeft;
    if(element.scrollHeight)
      coordinates.top = coordinates.top - element.scrollTop;
  }
  return coordinates;
}
