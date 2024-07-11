import { useState } from "react";
import { cloneDeep } from "lodash-es";
import { isArray } from "lodash-es";

import FormManager from "./FormManager";

function useForm(initialState) {
    const emptyValue = () => isArray(initialState.values) ? [] : {};

    const defaultState = {
      values: cloneDeep(initialState.values) || emptyValue(),
      initialValues: cloneDeep(initialState.initialValues || initialState.values) || emptyValue(),
      formattedValues: initialState.formattedValues || emptyValue(),
      touched: initialState.touched || emptyValue(),
      valid: initialState.valid || emptyValue()
    };

    const [state, setState] = useState(defaultState);

    return new FormManager(state, setState);
}

export default useForm;
