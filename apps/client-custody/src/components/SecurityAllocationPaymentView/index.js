import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import withStyles from '@mui/styles/withStyles';
import makeStyles from '@mui/styles/makeStyles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import changeCase from 'change-case';

import convertNumberToIntlFormat from '../../utils/convertNumberToIntlFormat';

// TODO: CLEANUP

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#143673',
    color: theme.palette.common.white,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

const SecurityAllocationPaymentView = ({ subscriptions, sukukData }) => {
  const classes = useStyles();
  const { t } = useTranslation(['admission']);
  const { denominationName = {} } = sukukData;

  const getRows = (data) => {
    const rows = [];
    const value = denominationName?.value;
    let totalAmount = 0;
    let totalShares = 0;
    data.forEach((el) => {
      totalAmount += parseInt(el.subscriptionAmount, 10);
      const shares = parseInt(el.subscriptionAmount, 10) / parseInt(value, 10);
      totalShares += shares;

      rows.push(
        <StyledTableRow key={el.id}>
          <StyledTableCell>{`${changeCase.titleCase(el?.entityGroup?.entity?.corporateEntityName ?? '')}` ?? 'N/A'}</StyledTableCell>
          <StyledTableCell align="right">{convertNumberToIntlFormat(el.subscriptionAmount)}</StyledTableCell>
          <StyledTableCell align="right">{convertNumberToIntlFormat(shares)}</StyledTableCell>
        </StyledTableRow>,
      );
    });
    if (data.length) {
      rows.push(
        <StyledTableRow key="total">
          <StyledTableCell>{t('admission:Accordian.Securities Allocations & Payment Instructions.Headers.Total')}</StyledTableCell>
          <StyledTableCell align="right">{convertNumberToIntlFormat(totalAmount)}</StyledTableCell>
          <StyledTableCell align="right">{convertNumberToIntlFormat(totalShares)}</StyledTableCell>
        </StyledTableRow>,
      );
    }
    return rows;
  };
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>{t('admission:Accordian.Securities Allocations & Payment Instructions.Headers.Client Account')}</StyledTableCell>
            <StyledTableCell align="right">{t('admission:Accordian.Securities Allocations & Payment Instructions.Headers.Pre-Allocation Amounts')}</StyledTableCell>
            <StyledTableCell align="right">{t('admission:Accordian.Securities Allocations & Payment Instructions.Headers.Certificates')}</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>{subscriptions ? getRows(subscriptions) : ''}</TableBody>
      </Table>
    </TableContainer>
  );
};

SecurityAllocationPaymentView.propTypes = {
  subscriptions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  sukukData: PropTypes.shape({
    denominationName: PropTypes.shape({}),
  }).isRequired,
};

SecurityAllocationPaymentView.defaultProps = {};

export default SecurityAllocationPaymentView;
