import { Fragment } from 'react';
import PropTypes from 'prop-types';

import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';

import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import InfoIcon from '@mui/icons-material/Info';

const OptionWithCallout = ({ entityTypeValues, setFieldValue, entry }) => {
  const name = entry.id;
  const { label, calloutText } = entry;

  const existingIndex = entityTypeValues.findIndex((el) => el.questionId === name);

  const handleClick = () => {
    const updated = [...entityTypeValues];
    if (existingIndex === -1) {
      // updated.push({
      //   questionId: name,
      // });
      updated[0] = { questionId: name };
    } else {
      updated.splice(existingIndex, 1);
    }
    setFieldValue('entityType', updated, true);
  };

  const selected = existingIndex !== -1;

  return (
    <Grid container justifyContent="flex-start" alignItems="flex-start" className="flex-nowrap py-2">
      {selected ? <CheckBoxIcon fontSize="small" onClick={handleClick} /> : <CheckBoxOutlineBlankIcon fontSize="small" onClick={handleClick} />}
      <p className="my-0 mx-2">{label}</p>
      {calloutText ? (
        <Tooltip
          arrow
          title={
            <Fragment>
              <Typography color="inherit">{calloutText}</Typography>
            </Fragment>
          }
          placement="right"
        >
          <InfoIcon fontSize="small" color="disabled" />
        </Tooltip>
      ) : (
        ''
      )}
    </Grid>
  );
};

OptionWithCallout.propTypes = {
  title: PropTypes.string.isRequired,
};

export default OptionWithCallout;
