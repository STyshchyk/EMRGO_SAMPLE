import { useField } from 'formik';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import style from './style.module.scss';

const AnimatedInputField = ({ name, label, type }) => {
  const [field, meta, helpers] = useField({ name, label, type });
  const { t } = useTranslation(['yup']);

  return (
    <div className={style['input-group']}>
      <input className={style['input-group__field']} type={type} {...field} id={name} onChange={(e) => helpers.setValue(e.target.value)} />
      <label className={style['input-group__floating-label']} htmlFor={name}>
        {label}
      </label>
      {meta.touched && meta.error ? <div className={style['input-group__error']}>{t(`${meta.error.transKey}`, meta.error.options)}</div> : null}
    </div>
  );
};

AnimatedInputField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
};

AnimatedInputField.defaultProps = {
  type: 'text',
};

export default AnimatedInputField;
