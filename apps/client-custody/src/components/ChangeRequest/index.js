import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { titleCase } from 'change-case';
import { useSelector } from 'react-redux';
// import cx from 'classnames';

import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';

import Select from 'react-select';
import makeAnimated from 'react-select/animated';

import { selectCurrentEntityGroup } from '../../redux/selectors/auth';

import selectStyles from '../../styles/cssInJs/reactSelect';

const animatedComponents = makeAnimated();

const ChangeRequest = ({ setFieldValue, changeRequests, fieldKey }) => {
  const { t } = useTranslation(['translation', 'kyc', 'components']);
  const currentEntityGroup = useSelector(selectCurrentEntityGroup);
  const entityType = currentEntityGroup?.entityType;
  const changeRequest = changeRequests[fieldKey] || '';

  const options = [
    { value: 'updateDetails', label: t('Miscellaneous.Update Details') },
    { value: 'required', label: t('Miscellaneous.Required') },
    { value: 'provideSupportingDocs', label: t('Miscellaneous.Provide Supporting Docs') },
  ];

  const selectedChange = options.find((request) => request.value === changeRequest);
  return (
    <Fragment>
      {entityType === 'EMRGO_SERVICES' ? (
        <FormControl className="w-full">
          <Select
            closeMenuOnSelect
            isSearchable
            isClearable
            placeholder={`${t('components:Select.Select')}...`}
            components={{
              ...animatedComponents,
            }}
            styles={selectStyles}
            value={selectedChange}
            options={options}
            onChange={(selected) => {
              if (selected === null) {
                const tempRequests = { ...changeRequests };
                delete tempRequests[fieldKey];
                setFieldValue(`changeRequests`, tempRequests);
              } else {
                setFieldValue(`changeRequests.${fieldKey}`, selected.value);
              }
            }}
          />
        </FormControl>
      ) : (
        <Fragment>
          {changeRequest !== null && changeRequest !== undefined ? (
            <Typography align="right" className="text-yellow-500 mt-4">
              {titleCase(changeRequest)}
            </Typography>
          ) : (
            ''
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

ChangeRequest.propTypes = {
  setFieldValue: PropTypes.func.isRequired,
  changeRequests: PropTypes.object.isRequired,
  fieldKey: PropTypes.string.isRequired,
};

export default ChangeRequest;
