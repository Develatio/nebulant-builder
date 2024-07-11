export const basicHandler = {
  filter: value => {
    return value;
  },
  parse: value => {
    return value;
  },
  format: value => {
    return value;
  },
  validate: _value => {
    return true;
  }
};

export const numberHandler = {
  filter: value => {
    return value.match("[0-9\.-]*")[0];
  },
  parse: value => {
    const floatValue = parseFloat(value);

    return !isNaN(floatValue) ? floatValue : null;
  },
  format: value => {
    return value + '';
  },
  validate: value => {
    return !isNaN(value);
  }
};

export const fileHandler = {
  ...basicHandler,
  parse: (files) => {
    return files.length == 1 ? files[0] : files;
  }
};
