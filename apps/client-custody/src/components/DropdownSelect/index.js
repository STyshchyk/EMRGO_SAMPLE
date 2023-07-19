/* eslint-disable react/jsx-props-no-spreading */
import cx from 'classnames';
import { useField } from 'formik';
import Select, { components } from 'react-select';
import Icon from '@mdi/react';
import { mdiChevronUp, mdiChevronDown } from '@mdi/js';
import PropTypes from 'prop-types';

import Required from 'components/Required';
import style from './style.module.scss';

const customSelectStyles = {
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
  container: (provided) => ({
    ...provided,
    gridArea: 'field',
    maxWidth: '250px',
  }),
  control: (provided) => ({
    ...provided,
    backgroundColor: '#e6e6e6',
    borderRadius: '13px',
    border: 0,
    minHeight: '36px',
    outline: 'none',
    width: '100%',
  }),

  indicatorSeparator: (provided) => ({
    ...provided,
    display: 'none',
  }),

  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#28ccbf' : '#fff',
    color: state.isFocused ? '#fff' : '#23389c',
    borderRadius: '13px',
  }),

  placeholder: (provided) => ({
    ...provided,
    color: '#8d99bf',
    display: 'flex',
    justifyContent: 'start',
    width: '100%',
  }),

  singleValue: (provided) => ({
    ...provided,
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '4px',
    color: '#23389c',
  }),

  multiValue: (provided) => ({
    ...provided,
    color: '#fff',
    backgroundColor: '#28ccbf',
    borderRadius: '50px',
  }),
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: data.color,
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: data.color,
    ':hover': {
      color: '#eb0000',
    },
  }),
  menu: (provided) => ({
    ...provided,
    width: '100%',
    borderRadius: '13px',
  }),
};

const customSelectStylesAlignedCenter = {
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
  control: (provided) => ({
    ...provided,
    backgroundColor: '#e6e6e6',
    borderRadius: '13px',
    border: 0,
    minHeight: '36px',
    outline: 'none',
    width: '250px',
    gridArea: 'field',
  }),

  indicatorSeparator: (provided) => ({
    ...provided,
    display: 'none',
  }),

  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#28ccbf' : '#fff',
    color: state.isFocused ? '#fff' : '#23389c',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    paddingRight: '2.5rem',
    borderRadius: '13px',
  }),

  placeholder: (provided) => ({
    ...provided,
    color: '#8d99bf',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  }),

  singleValue: (provided) => ({
    ...provided,
    color: '#23389c',
    backgroundColor: 'transparent',
    border: 'none',
    display: 'flex',
    justifyContent: 'center',
  }),

  input: (provided) => ({
    ...provided,
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    textAlign: 'center',
  }),

  menu: (provided) => ({
    ...provided,
    width: '250px',
    borderRadius: '13px',
  }),
};

const DropdownIndicator = (props) => {
  // eslint-disable-next-line react/prop-types
  const { selectProps } = props;
  // eslint-disable-next-line react/prop-types
  const { menuIsOpen } = selectProps;

  return (
    <components.DropdownIndicator {...props}>
      <Icon path={menuIsOpen ? mdiChevronUp : mdiChevronDown} className={style['dropdown-indicator']} title="Open" size={1} />
    </components.DropdownIndicator>
  );
};

const DropdownSelect = (props) => {
  const { name, label, options, placeholder, align, disableLabel, disabled, isMulti, fullWidth, customOnchange, isClearable, refProp, isRequired, dataTestId } = props;
  const [field, meta, helpers] = useField(props);

  let selectedValue = null;

  options.forEach((option) => {
    if (field.value?.value === option.value) {
      selectedValue = option;
    }
  });

  return (
    <div className={cx(style.container, fullWidth ? style.fullWidth : '')} data-testid={dataTestId}>
      <div className={style['input-group']}>
        {label === '' ? (
          ''
        ) : (
          <label
            className={cx(style['input-group__label'], {
              [style['input-group__label--hidden']]: disableLabel,
            })}
            htmlFor={name}
          >
            {label}
            {isRequired && <Required />}{' '}
          </label>
        )}
        <Select
          className="select"
          isDisabled={disabled}
          components={{ DropdownIndicator }}
          name={field.name}
          menuPortalTarget={document.body}
          onBlur={field.onBlur}
          onChange={(option) => {
            helpers.setValue(option);
            customOnchange(option);
          }}
          isClearable={isClearable}
          options={options}
          placeholder={placeholder}
          styles={align === 'center' ? customSelectStylesAlignedCenter : customSelectStyles}
          // value={field.value}
          value={selectedValue}
          isMulti={isMulti}
          ref={refProp}
          aria-label={dataTestId}
          closeMenuOnScroll={(event) => event.target.id === 'scroll-container'}
        />
      </div>
      {meta.touched && meta.error ? <div className={style['input-group__error']}>{meta.error}</div> : null}
    </div>
  );
};

DropdownSelect.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  options: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.func]).isRequired,
  placeholder: PropTypes.string,
  align: PropTypes.string,
  disableLabel: PropTypes.bool,
  disabled: PropTypes.bool,
  isMulti: PropTypes.bool,
  fullWidth: PropTypes.bool,
  customOnchange: PropTypes.func,
  isClearable: PropTypes.bool,
  refProp: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })]),
};

DropdownSelect.defaultProps = {
  label: '',
  placeholder: 'Select...',
  align: 'left',
  disableLabel: false,
  disabled: false,
  isMulti: false,
  fullWidth: false,
  customOnchange: () => {},
  isClearable: false,
  refProp: null,
};

export default DropdownSelect;
