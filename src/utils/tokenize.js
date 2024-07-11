// Receives a string and applies multiple regexp. Each match is stored as an object that contains the match and the type
// of regexp that caused the match.
// Finally the "result" is returned. The result is an array that contains strings and objects. The strings are the parts
// of the received string that weren't matches by any regexp. The objects are the matches pieces of the received string.
// The result is suitable to be ingested in the order it's elements are placed inside the array, meaning that the callee
// might just do result.map(chunk => typeof chunk == "string" ? chunk : chunk.text) and obtain the string that was
// initially passed.

const regexps = [
  {
    type: "uuid",
    regexp: new RegExp("[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}", "ig"),
  },
  //{
  //  type: "url",
  //  // This regexp doesn't support any type of non-ascii characters. We're able to run it very quickly and get a
  //  // good-ish url detection, but it's not perfect. If we supported non-ascii characters, detection would be orders of
  //  // magnitude slower, but we'll match all URLs.
  //  regexp: new RegExp(/(https?:\/\/)?([\w-]+\.)+[\w]{2,}(?:\.\w{2,})?(\/\S*)?(:\d{1,5})?(\/\S*)?(\?(\w+=\w+&?)*)?/, "ig"),
  //},
  {
    type: "void",
    regexp: new RegExp(/(ws:\/\/)(\w+\.?)+(:\d{1,5})?(\/\S+)*/, "ig")
  },
];

export const tokenize = (t) => {
  let res = [];

  for(const regexp_obj of regexps) {
    for(const match of t.matchAll(regexp_obj.regexp)) {
      res.push({
        type: regexp_obj.type,
        match: match[0],
        from: match.index,
        to: match.index + match[0].length - 1,
      });
    }
  }

  // Remove matches that are inside other matches
  res = res.filter(match => {
    return !res.some(m => {
      // skip if this is the same match
      if(match.from == m.from && match.to == m.to) return false;

      return match.from >= m.from && match.to <= m.to;
    });
  });

  if(res.length == 0) return null;

  res = res.sort((a, b) => a.from - b.from);

  let pointer = 0;
  const final = [];

  while(res.length) {
    let tmp = res.shift();

    final.push(t.substring(pointer, tmp.from));

    final.push({
      type: tmp.type,
      text: tmp.match,
    });

    pointer = tmp.to + 1;
  }

  if(pointer < t.length) {
    final.push(t.substring(pointer));
  }

  return final;
}
