import { useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { useDispatch } from 'react-redux';
import { useFormikContext } from 'formik';
import * as formActionCreators from '../../redux/actionCreators/form';

const AutoSaveFields = ({ selectedRow, initial, formKey }) => {
  const dispatch = useDispatch();
  const { values } = useFormikContext();

  const saveFormValues = (value) => {
    const obj = {
      settings: [
        {
          key: formKey,
          value: JSON.stringify(value),
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
