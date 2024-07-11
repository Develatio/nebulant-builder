export const getXPath = (element) => {
  let selector = '';
  let isRoot;
  let currentElement = element;

  do {
    const tagName = currentElement.tagName.toLowerCase();
    const parentElement = currentElement.parentElement;

    if(parentElement.childElementCount > 1) {
      const parentsChildren = [...parentElement.children];

      let tag = [];
      parentsChildren.forEach(child => {
        if(child.tagName.toLowerCase() === tagName) tag.push(child);
      })

      if(tag.length === 1) {
        selector = `/${tagName}${selector}`;
      } else {
        const position = tag.indexOf(currentElement) + 1;
        selector = `/${tagName}[${position}]${selector}`;
      }
    } else {
      selector = `/${tagName}${selector}`;
    }

    currentElement = parentElement;
    isRoot = parentElement.tagName.toLowerCase() === 'html';

    if(isRoot) selector = `/html${selector}`;
  } while(isRoot === false);

  return selector;
}
