import moment from 'moment';
import { titleCase } from 'change-case';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import grey from '@material-ui/core/colors/grey';
import red from '@material-ui/core/colors/red';

import tableStyles from '../../styles/cssInJs/materialTable';

export const titleRenderer = (value) => {
  const titledValue = titleCase(value);
  return titledValue;
};

export const dateRenderer = (date) => {
  const inputDate = moment(date);
  let formattedDate = 'NA';
  if (inputDate.isValid()) {
    formattedDate = inputDate.format('DD/MM/YYYY');
  }
  return formattedDate;
};

export const currencyRenderer = (value) =>
  new Intl.NumberFormat('en', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

export const floatRenderer = (value) =>
  new Intl.NumberFormat('en', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export const readyToSettleRenderer = (cell) => {
  let readyToSettle = (
    <Typography variant="body1" style={{ color: 'red' }}>
      {cell.label}
    </Typography>
  );
  if (cell.value) {
    readyToSettle = (
      <Typography variant="body1" style={{ color: 'green' }}>
        {cell.label}
      </Typography>
    );
  }
  return readyToSettle;
};

export const settleButtonRenderer = (instance, td, row, col, prop, value, settleTrade) => {
  // Handsontable.dom.empty(td);
  const { settlementStatus } = value.investor;
  const elementList = document.createElement('div');
  let element = '';

  switch (settlementStatus) {
    case 'In Queue':
    case 'Settling':
    case 'Settled':
      element = document.createElement('button');
      element.setAttribute('type', 'button');
      element.disabled = true;
      element.classList.add('btn', 'btn--micro', 'btn-text--small-text', 'btn--disabled');
      element.append(document.createTextNode('Settle'));
      break;
    case 'Ready to Settle':
      element = document.createElement('button');
      element.setAttribute('type', 'button');
      element.disabled = false;
      element.addEventListener('click', () => {
        settleTrade(value);
      });
      element.classList.add('btn', 'btn--micro', 'btn-text--small-text', 'btn--secondary');
      element.append(document.createTextNode('Settle'));
      break;
    default:
      element = document.createTextNode('N/A');
  }

  elementList.append(element);
  td.append(elementList);
  return td;
};

export const fontColorRenderer = (data, color) => {
  let textColor = grey[800];
  switch (color) {
    case 'green':
      textColor = green['500'];
      break;
    case 'red':
      textColor = red['500'];
      break;
    case 'grey':
      textColor = grey['800'];
      break;
    case 'amber':
      textColor = amber['500'];
      break;
    default:
      break;
  }
  const coloredText = (
    <Typography variant="subtitle2" style={{ color: textColor }}>
      {data}
    </Typography>
  );
  return coloredText;
};

export const quoteDateRenderer = (date) => {
  let formattedDate = 'NA';
  const inputDate = moment(date);
  if (!inputDate.isValid()) return 'N/A';
  if (inputDate.isSame(moment(), 'day')) {
    formattedDate = inputDate.format('H:mm');
  } else {
    formattedDate = inputDate.format('DD/MM/YYYY');
  }

  return formattedDate;
};

// export const tooltipRenderer = (component, text) => <Tooltip title={text}>{component}</Tooltip>;
export const tooltipRenderer = (component, text) => (
  <Tooltip title={text} placement="bottom-start" arrow>
    <Typography style={{ ...tableStyles.rowStyle, ...tableStyles.cellStyle, cursor: 'help' }}>{component}</Typography>
  </Tooltip>
);
