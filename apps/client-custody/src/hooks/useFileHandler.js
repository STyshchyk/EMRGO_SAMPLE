import { createRef, useReducer } from "react";

import { useField } from "formik";
import { produce } from "immer";

const actionTypes = {
  load: "LOAD",
  clear: "CLEAR",
};

const initialState = {
  files: [],
  isLoaded: false,
};

function reducer(state, action) {
  switch (action.type) {
    case actionTypes.load:
      return produce(state, (draft) => {
        draft.files = action.payload.files;
        draft.isLoaded = true;
      });
    case actionTypes.clear:
      return initialState;
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

const useFileHandler = (name) => {
  const fileInputRef = createRef();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [, , helpers] = useField(name);

  // accepts an event and custom callback
  const onChange = (e, customOnChange) => {
    e.preventDefault();

    if (fileInputRef.current?.files.length > 0) {
      const arrayFiles = [...fileInputRef.current.files];
      const files = arrayFiles.map((file, index) => ({
        id: index,
        file,
      }));
      dispatch({
        type: actionTypes.load,
        payload: {
          files,
        },
      });
      helpers.setValue({
        files,
      });

      if (customOnChange && typeof customOnChange === "function") {
        customOnChange(e.target.files);
      }
    } else {
      dispatch({ type: actionTypes.clear });
      helpers.setValue({
        files: [],
      });
    }
  };

  const onCancel = (e) => {
    e.stopPropagation();
    e.preventDefault();

    dispatch({ type: actionTypes.clear });
    helpers.setValue({
      files: [],
    });
    fileInputRef.current.value = null;
  };

  const setDefaultFiles = (files) => {
    dispatch({
      type: actionTypes.load,
      payload: {
        files,
      },
    });
  };

  return {
    fileInputRef,
    onCancel,
    onChange,
    setDefaultFiles,
    ...state,
  };
};

export default useFileHandler;
