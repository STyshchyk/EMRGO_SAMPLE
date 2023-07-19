import changeCase from 'change-case';
import Chip from '@material-ui/core/Chip';

import amber from '@material-ui/core/colors/amber';
import grey from '@material-ui/core/colors/grey';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';

const chipStyle = {
  borderRadius: '3px',
  textTransform: 'uppercase',
  height: '20px',
  fontWeight: '700',
  fontSize: '0.7rem',
};

export const typeRenderer = (value) => {
  let bgColor = grey[300];
  let textColor = grey[800];
  switch (value) {
    case 'MFA reset':
      bgColor = amber['100'];
      textColor = amber['800'];
      break;
    case 'Password reset':
      bgColor = red['100'];
      textColor = red['800'];
      break;
    default:
      break;
  }
  const statusChip = <Chip label={changeCase.titleCase(value)} style={{ ...chipStyle, backgroundColor: bgColor, color: textColor }} />;
  return statusChip;
};

export const statusRenderer = (value) => {
  let bgColor = grey[300];
  let textColor = grey[800];
  let text = 'Pending';
  if (value) {
    bgColor = green['100'];
    textColor = green['800'];
    text = 'Approved';
  } else {
    bgColor = grey['300'];
    textColor = grey['800'];
    text = 'Pending';
  }
  const statusChip = <Chip label={changeCase.titleCase(text)} style={{ ...chipStyle, backgroundColor: bgColor, color: textColor }} />;
  return statusChip;
};

export const titleRenderer = (value) => changeCase.titleCase(value);
