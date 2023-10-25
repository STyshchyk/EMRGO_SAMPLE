import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";

import { useFormikContext } from "formik";
import debounce from "lodash.debounce";

import * as formActionCreators from "../../redux/actionCreators/form";

const AutoSaveFields = ({ selectedRow, initial, formKey }) => {
  const dispatch = useDispatch();
  const { values } = useFormikContext();

  const saveFormValues = (value) => {
    const obj = {
      settings: [
        {
          key: formKey,
          value: JSON.stringify(value),
          isActive: true,
        },
      ],
    };
    dispatch(formActionCreators.doPostFormRequested(obj));
  };

  const debouncedHandleSaveValues = useMemo(() => debounce(saveFormValues, 1000), []);
  useEffect(() => {
    const equal = JSON.stringify(values) === JSON.stringify(initial);

    if (!equal && !selectedRow) {
      debouncedHandleSaveValues(values);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  return null;
};

export default AutoSaveFields;
