import { useCallback } from 'react';
import { fieldToTextField } from 'formik-material-ui';
import { useTranslation } from 'react-i18next';
import MuiTextField from '@mui/material/TextField';

const CustomTextField = (props) => {
  const { t } = useTranslation(['yup']);

  const {
    form: { setFieldValue },
    field: { name },
  } = props;

  const onChange = useCallback(
    (event) => {
      setFieldValue(name, event.target?.value ?? '');
    },
    [setFieldValue, name],
  );

  const fieldToTextFieldProps = fieldToTextField(props);
  const customTextFieldProps = { ...fieldToTextFieldProps, helperText: t(fieldToTextFieldProps.helperText?.transKey) ?? ' ' };

  return <MuiTextField {...customTextFieldProps} onChange={onChange} />;
};

export default CustomTextField;
