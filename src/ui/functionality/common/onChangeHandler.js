import { BaseIntellisense } from "@src/intellisense/base/BaseIntellisense";

export const onChange = (props, value) => {
  props.form.set(props.path, value);
  props.form.setTouched(props.path, true);
}

export const onChangeNumeric = (props, value) => {
  // We DON'T actually want to convert the "value" to "0". This is because users
  // might want to type an interpollable string in the field. If they do so, the
  // "parseInt" will fail, but the value will be valid.
  try {
    const newValue = parseInt(value);
    if(!isNaN(newValue)) {
      value = newValue;
    }
   } catch (_error) {
    //value = 0;
  }

  props.form.set(props.path, value);
  props.form.setTouched(props.path, true);
};

export const triggerIntellisense = (props) => {
  BaseIntellisense.predict({ node: props.node }).then(({ value, caretPositions, input }) => {
    props.form.set(props.path, value);
    props.form.setTouched(props.path, true);

    setTimeout(() => {
      input.selectionStart = caretPositions[0];
      input.selectionEnd = caretPositions[1];
    });
  }, () => {}).catch(() => {});
}

export const triggerIntellisenseWithInputEvent = (props) => {
  BaseIntellisense.predict({ node: props.node }).then(({ value, caretPositions, input }) => {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    nativeInputValueSetter.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));

    setTimeout(() => {
      input.selectionStart = caretPositions[0];
      input.selectionEnd = caretPositions[1];
    });
  }, () => {}).catch(() => {});
}
