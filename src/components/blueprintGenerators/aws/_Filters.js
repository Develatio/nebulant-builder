export const formatFilters = (Filters) => {
  // "filter" is an object with the following structure:
  //
  //  {
  //    name: "foo",
  //    value: "bar",
  //  }
  //
  // or
  //
  //  {
  //    name: "foo",
  //    value: ["bar", 42, "xyz"],
  //  }
  return Filters?.map(filter => {
    let name = filter.name;

    // We want to end up with an array no matter what, and we want it to contain
    // only strings.
    let values;
    if(Array.isArray(filter.value)) {
      values = filter.value.map(v => `${v}`);
    } else {
      values = [`${filter.value}`];
    }

    // There are some special cases. If we passed a filter with the following
    // structure:
    //
    //  {
    //    name: "tag",
    //    value: ["foo", "bar"],
    //  }
    //
    // it means that we have a "valid raw" AWS tag, which means that we want to
    // use the first value in the "value" array as the tag's name and the second
    // value as the tag's value.
    if(name == "tag") {
      name = `tag:${filter.value[0]}`;
      values = [`${filter.value[1]}`];
    }

    return {
      Name: name,
      Values: values,
    };
  });
}
