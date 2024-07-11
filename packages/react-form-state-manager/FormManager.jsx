import { util } from "@joint/core";
import { get, isArray, set, unset } from "lodash-es";

import { basicHandler, fileHandler, numberHandler } from "./InputHandlers";

export default class FormManager {
  constructor(state, stateSetter) {
    this.state = state;
    this.stateSetter = stateSetter;
    this.values = {};
    this.initialValues = {};
    this.formattedValues = {};
    this.touched = {};
    this.valid = {};
    this.copyState(state);
  }

  setState(value) {
    this.stateSetter((state) => {
      const newState = util.isFunction(value) ? value(state) : value;
      this.copyState(newState);
      return newState;
    });
  }

  copyState(state) {
    this.values = state.values;
    this.formattedValues = state.formattedValues;
    this.initialValues = state.initialValues;
    this.valid = state.valid;
    this.touched = state.touched;
  }

    text(name, options = {}) {
    options.name = name;
    options.type = "text";

    return this.input(options);
  }

  password(name, options = {}) {
    options.name = name;
    options.type = "password";

    return this.input(options);
  }

  number(name, options = {}) {
    options.name = name;
    options.type = "number";
    options.inputHandler = util.merge({}, numberHandler, options.inputHandler);

    return this.input(options);
  }

  email(name, options = {}) {
    options.name = name;
    options.type = "email";

    return this.input(options);
  }

  url(name, options = {}) {
    options.name = name;
    options.type = "url";

    return this.input(options);
  }

  color(name, options = {}) {
    options.name = name;
    options.type = "color";

    return this.input(options);
  }

  date(name, options = {}) {
    options.name = name;
    options.type = "date";

    return this.input(options);
  }

  datetimeLocal(name, options = {}) {
    options.name = name;
    options.type = "datetime-local";

    return this.input(options);
  }

  month(name, options = {}) {
    options.name = name;
    options.type = "month";

    return this.input(options);
  }

  search(name, options = {}) {
    options.name = name;
    options.type = "search";

    return this.input(options);
  }

  tel(name, options = {}) {
    options.name = name;
    options.type = "tel";

    return this.input(options);
  }

  time(name, options = {}) {
    options.name = name;
    options.type = "time";

    return this.input(options);
  }

  week(name, options = {}) {
    options.name = name;
    options.type = "week";

    return this.input(options);
  }

  input(options ) {
    options.inputHandler = util.merge({}, basicHandler, options.inputHandler);

    return {
      type: options.type,
      name: options.name,
      value: this.getInputValue(options.name, options.inputHandler),
      onChange: this.inputChangeHandler(options),
      onFocus: this.basicFocusHandler(options),
      onBlur: this.inputBlurHandler(options),
      onKeyDown: this.inputKeyDownHandler(options),
    };
  }

  textarea(name, options = {}) {
    options.name = name;
    options.inputHandler = util.merge({}, basicHandler, options.inputHandler);

    return {
      name,
      value: this.getInputValue(name, options.inputHandler),
      onChange: this.inputChangeHandler(options),
      onFocus: this.basicFocusHandler(options),
      onBlur: this.inputBlurHandler(options)
    };
  }

  getInputValue(name, inputHandler) {
    let value = null;

    if (this.hasFormattedValue(name)) {
      value = this.getFormattedValue(name);
    } else if (this.hasParsedValue(name)) {
      value = inputHandler.format(this.getParsedValue(name))
    }

    if (this.isEmpty(value)) {
      value = "";
    }


    return value;
  }

  file(name, options = {}) {
    options.name = name;
    options.type = "file";
    options.inputHandler = util.merge({}, fileHandler, options.inputHandler);

    return {
      type: "file",
      name,
      onChange: this.fileChangeHandler(options),
      onFocus: this.basicFocusHandler(options),
      onBlur: this.basicBlurHandler(options)
    };
  }

  inputChangeHandler({ inputHandler, onChange }) {
    return (event) => {
      let { name, value, required } = event.target;

      value = inputHandler.filter(value);

      const parsedValue = inputHandler.parse(value);
      const valueIsEmpty = this.isEmpty(value);
      const valid = event.target.checkValidity() && ((valueIsEmpty && !required) || (!valueIsEmpty && inputHandler.validate(parsedValue)));

      if (onChange) {
        onChange(parsedValue, event);
      }

      this.setParsedValue(name, parsedValue);
      this.setFormattedValue(name, value);
      this.setValidity(name, valid);
    };
  }

  basicFocusHandler({ onFocus }) {
    return (event) => {
      const { name } = event.target;

      const parsedValue = this.getParsedValue(name);

      if (onFocus) {
        onFocus(parsedValue, event);
      }
    };
  }

  basicBlurHandler({ onBlur }) {
    return (event) => {
      const { name } = event.target;

      this.setTouched(name, true);

      if (onBlur) {
        onBlur(this.getParsedValue(name), event);
      }
    };
  }

  inputBlurHandler({ inputHandler, onBlur }) {
    return (event) => {
      const { name } = event.target;

      const parsedValue = this.getParsedValue(name);
      const formattedValue = !this.isEmpty(parsedValue) ? inputHandler.format(parsedValue) : null;

      this.setFormattedValue(name, formattedValue);
      this.setTouched(name, true);

      if (onBlur) {
        onBlur(parsedValue, event);
      }
    };
  }

  inputKeyDownHandler({ name }) {
    return ({ key }) => {
      if (key === "Enter"){
        this.setTouched(name, true);
      }
    };
  }

  fileChangeHandler({ inputHandler, onChange }) {
    return (event) => {
      const { name, files } = event.target;

      const valueIsEmpty = files.length == 0;
      const valid = event.target.checkValidity() && (valueIsEmpty || inputHandler.validate(files));
      const file = !valueIsEmpty && valid ? inputHandler.parse(files) : null;

      this.setParsedValue(name, file);
      this.setValidity(name, valid);

      if (onChange) {
        onChange(file, event);
      }
    };
  }

  checkbox(name, { onChange, onFocus, onBlur } = {}) {
    const checked = !!this.getParsedValue(name);

    return {
      type: "checkbox",
      name,
      checked,
      onChange: this.checkboxChangeHandler({ onChange }),
      onFocus: this.basicFocusHandler({ onFocus }),
      onBlur: this.basicBlurHandler({ onBlur })
    };
  }

  checkboxChangeHandler({ onChange } = {}) {
    return (event) => {
      const { name } = event.target;

      const checked = !this.getParsedValue(name);

      this.setParsedValue(name, checked);
      this.setTouched(name, true);
      this.setValidity(name, true);

      if (onChange) {
        onChange(checked, event);
      }
    };
  }

  radio(name, value, { key, onChange, onFocus, onBlur } = {}) {
    return {
      type: "radio",
      name,
      checked: this.isEqual(this.getParsedValue(name), value, key),
      onChange: this.radioChangeHandler({ value, onChange }),
      onFocus: this.basicFocusHandler({ onFocus }),
      onBlur: this.basicBlurHandler({ onBlur })
    };
  }

  radioChangeHandler({ value, onChange } = {}) {
    return (event) => {
      const { name } = event.target;

      this.setParsedValue(name, value);
      this.setTouched(name, true);
      this.setValidity(name, true);

      if (onChange) {
        onChange(value, event);
      }
    };
  }

  checklist(name, value, { key, onChange, onFocus, onBlur } = {}) {
    return {
      type: "checkbox",
      name,
      checked: this.contains(this.getParsedValue(name) || [], value, key),
      onChange: this.checklistChangeHandler({ value, key, onChange }),
      onFocus: this.basicFocusHandler({ onFocus }),
      onBlur: this.basicBlurHandler({ onBlur })
    };
  }

  checklistChangeHandler({ value, key, onChange } = {}) {
    return (event) => {
      const { name } = event.target;

      const list = util.cloneDeep(this.getParsedValue(name)) || [];
      const index = this.findIndex(list, value, key);

      if (index > -1) {
        this.delete(name, index);
        list.splice(index, 1);
      } else {
        this.append(name, value);
        list.push(value);
      }

      this.setTouched(name, true);
      this.setValidity(name, true);

      if (onChange) {
        onChange(list, event);
      }
    };
  }

  select(name, options, { key, onChange, onFocus, onBlur } = {}) {
    const value = this.getParsedValue(name);

    return {
      name,
      value: options ? this.findIndex(options, value, key) : value,
      onChange: this.selectChangeHandler({ options, onChange }),
      onFocus: this.basicFocusHandler({ onFocus }),
      onBlur: this.basicBlurHandler({ onBlur })
    };
  }

  selectChangeHandler({ options, onChange } = {}) {
    return (event) => {
      const { name, value } = event.target;

      const parsedValue = options ? options[parseInt(value) || 0] : value;

      this.setParsedValue(name, parsedValue);
      this.setValidity(name, true);

      if (onChange) {
        onChange(parsedValue, event);
      }
    };
  }

  option(value) {
    return {
      value,
      key: value + ""
    };
  }

  get(name) {
    return this.getParsedValue(name);
  }

  set(name, value) {
    this.setState((state) => {
      if (util.isObject(name) || util.isFunction(name)) {
        return {
          ...state,
          values: util.isFunction(name) ? name(state.values) : name,
          formattedValues: {},
          valid: {},
        };
      }

      if (name) {
        return {
          ...state,
          values: set(
            { ...state.values },
            name,
            util.isFunction(value) ? value(get(state.values, name)) : value
          ),
          formattedValues: util.omit(state.formattedValues, name),
          valid: util.omit(state.valid, name),
        };
      }

      return {
        ...state,
        values: util.isFunction(value) ? value(state.values) : value,
        formattedValues: {},
        valid: {},
      };
    });
  }

  getParsedValue(name) {
    if (name) {
      return get(this.values, name, null);
    }

    return this.values;
  }

  hasParsedValue(name) {
    return this.getParsedValue(name) !== null;
  }

  setParsedValue(name, value) {
    this.setState((state) => {
      const oldValue = get(state.values, name);
      const newValue = util.isFunction(value) ? value(oldValue) : value;

      if (oldValue === newValue) {
        // Prevent rerender, return old state
        return state;
      }

      return {
        ...state,
        values: set(state.values, name, newValue),
      };
    });
  }

  setParsedValues(values) {
    this.setState((state) => {
      return {
        ...state,
        values: util.isFunction(values) ? values(state.values) : values
      };
    });
  }

  getInitialValue(name) {
    return get(this.initialValues, name, null);
  }

  hasInitialValue(name) {
    return this.getInitialValue(name) !== null;
  }

  setInitialValue(name, value) {
    this.setState((state) => {
      const oldValue = get(state.initialValues, name);
      const newValue = util.isFunction(value) ? value(oldValue) : value;

      if (oldValue === newValue) {
        // Prevent rerender, return old state
        return state;
      }

      return {
        ...state,
        initialValues: set(state.initialValues, name, newValue),
      };
    });
  }

  setInitialValues(values) {
    this.setState((state) => {
      return {
        ...state,
        initialValues: util.isFunction(values) ? values(state.initialValues) : values
      };
    });
  }

  getFormattedValue(name) {
    return get(this.formattedValues, name, null);
  }

  hasFormattedValue(name) {
    return this.getFormattedValue(name) !== null;
  }

  setFormattedValue(name, value) {
    this.setState((state) => {
      const oldValue = get(state.formattedValues, name);
      const newValue = util.isFunction(value) ? value(oldValue) : value;

      if (oldValue === newValue) {
        // Prevent rerender, return old state
        return state;
      }

      return {
        ...state,
        formattedValues: set(state.formattedValues, name, newValue),
      };
    });
  }

  setFormattedValues(values) {
    this.setState((state) => {
      return {
        ...state,
        formattedValues: util.isFunction(values) ? values(state.formattedValues) : values
      };
    });
  }

  isValid(name) {
    if (typeof name != "undefined") {
      return get(this.valid, name) || !util.has(this.valid, name);
    }

    return this.everythingIsValid();
  }

  everythingIsValid(value = this.valid) {
    let valid = true;

    if (util.isObject(value)) {
      Object.keys(value).map(key => {
        if (valid) {
          valid = this.everythingIsValid((value )[key]);
        }
      });
    } else if (value !== true) {
      valid = false;
    }

    return valid;
  }

  setValidity(name, valid) {
    this.setState((state) => {
      const oldValue = get(state.valid, name);
      const newValue = util.isFunction(valid) ? valid(oldValue) : valid;

      if (oldValue === newValue) {
        // Prevent rerender, return old state
        return state;
      }

      return {
        ...state,
        valid: set(state.valid, name, newValue),
      };
    });
  }

  getTouched(name) {
    return get(this.touched, name, false);
  }

  setTouched(name, touched) {
    this.setState((state) => {
      const oldValue = get(state.touched, name);
      const newValue = util.isFunction(touched) ? touched(oldValue) : touched;

      if (oldValue === newValue) {
        // Prevent rerender, return old state
        return state;
      }

      return {
        ...state,
        touched: set(state.touched, name, newValue),
      };
    });
  }

  changed(name) {
    if (typeof name != "undefined") {
      return !this.isEqual(this.getParsedValue(name), this.getInitialValue(name));
    }

    return !this.isEqual(this.initialValues || {}, this.values || {});
  }

  prepend(name, value) {
    this.setState((state) => {
      return {
        ...state,
        values: set(state.values, name, [value, ...get(state.values, name, [])]),
        formattedValues: set(state.formattedValues, name, [null, ...get(state.formattedValues, name, [])]),
        touched: set(state.touched, name, [null, ...get(state.touched, name, [])]),
        valid: set(state.valid, name, [null, ...get(state.valid, name, [])])
      };
    });
  }

  append(name, value) {
    this.setState((state) => {
      return {
        ...state,
        values: set(state.values, name, [...get(state.values, name, []), value]),
      };
    });
  }

  moveUp(name, index) {
    const prefix = name ? name + "." : "";

    this.swap(`${prefix}${index}`, `${prefix}${index - 1}`);
  }

  moveDown(name, index) {
    const prefix = name ? name + "." : "";

    this.swap(`${prefix}${index}`, `${prefix}${index + 1}`);
  }

  swap(first, second) {
    this.setState((state) => {
      const value = get(state.values, first);
      const formattedValue = get(state.formattedValues, first);
      const touched = get(state.touched, first);
      const valid = get(state.valid, first);

      set(state.values, first, get(state.values, second));
      set(state.formattedValues, first, get(state.formattedValues, second));
      set(state.touched, first, get(state.touched, second));
      set(state.valid, first, get(state.valid, second));

      set(state.values, second, value);
      set(state.formattedValues, second, formattedValue);
      set(state.touched, second, touched);
      set(state.valid, second, valid);

      return { ...state };
    });
  }

  splice(name, index, count) {
    this.setState((state) => {
      const lists = [
        get(state.values, name),
        get(state.formattedValues, name),
        get(state.touched, name),
        get(state.valid, name)
      ];

      lists.map((list) => {
        if (isArray(list)) {
          list.splice(index, count);
        }
      });

      return { ...state };
    });
  }

  delete(name, index) {
    if (typeof index != "undefined") {
      this.splice(name, index, 1);
    } else {
      this.setState((state) => {
        unset(state.values, name);
        unset(state.formattedValues, name);
        unset(state.touched, name);
        unset(state.valid, name);

        return { ...state };
      });
    }
  }

  reset(name,) {
    this.setState((state) => {
      // Reset whole state
      if (util.isObject(name) || util.isFunction(name)) {
        return {
          ...state,
          values: util.isFunction(name) ? name(state.values) : name,
          initialValues: util.cloneDeep(util.isFunction(name) ? name(state.initialValues) : name),
          formattedValues: {},
          touched: {},
          valid: {},
        };
      }

      // Reset single key
      if (name) {
        return {
          ...state,
          values: set(
            { ...state.values },
            name,
            util.cloneDeep(get(state.initialValues, name, null)),
          ),
          formattedValues: util.omit(state.formattedValues, name),
          touched: util.omit(state.touched, name),
          valid: util.omit(state.valid, name),
        };
      }

      // Reset entire state
      return {
        ...state,
        values: util.cloneDeep(this.initialValues),
        formattedValues: {},
        touched: {},
        valid: {}
      }
    });
  }

  isEqual(a, b, key) {
    if (typeof key != "undefined" && a !== null && b !== null) {
      return util.isEqual(a[key], b[key]);
    }

    return util.isEqual(a, b);
  }

  findIndex(list, value, key) {
    let index = -1;

    list.map((item, i) => {
      if (this.isEqual(item, value, key)) {
        index = i;
      }
    });

    return index;
  }

  contains(list, value, key) {
    return this.findIndex(list, value, key) > -1;
  }

  isEmpty(value) {
    return typeof value == "undefined" || value === "" || value === null;
  }
}
