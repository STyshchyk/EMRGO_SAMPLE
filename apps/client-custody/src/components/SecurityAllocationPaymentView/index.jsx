import { useTranslation } from "react-i18next";

import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import v from "voca";
import PropTypes from "prop-types";

import convertNumberToIntlFormat from "../../utils/convertNumberToIntlFormat";

const PREFIX = "SecurityAllocationPaymentView";

const classes = {
  head: `${PREFIX}-head`,
  root: `${PREFIX}-root`,
  table: `${PREFIX}-table`,
};

const StyledTableContainer = styled(TableContainer)({
  [`& .${classes.table}`]: {
    minWidth: 700,
  },
});

// TODO: CLEANUP

const StyledTableCell = TableCell;

const StyledTableRow = TableRow;

const SecurityAllocationPaymentView = ({ subscriptions, sukukData }) => {
  const { t } = useTranslation(["admission"]);
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
        <StyledTableRow
          key={el.id}
          classes={{
            root: classes.root,
          }}
        >
          <StyledTableCell
            classes={{
              head: classes.head,
            }}
          >
            {`${v.capitalize(el?.entityGroup?.entity?.corporateEntityName ?? "")}` ?? "N/A"}
          </StyledTableCell>
          <StyledTableCell
            align="right"
            classes={{
              head: classes.head,
            }}
          >
            {convertNumberToIntlFormat(el.subscriptionAmount)}
          </StyledTableCell>
          <StyledTableCell
            align="right"
            classes={{
              head: classes.head,
            }}
          >
            {convertNumberToIntlFormat(shares)}
          </StyledTableCell>
        </StyledTableRow>
      );
    });
    if (data.length) {
      rows.push(
        <StyledTableRow
          key="total"
          classes={{
            root: classes.root,
          }}
        >
          <StyledTableCell
            classes={{
              head: classes.head,
            }}
          >
            {t("admission:Accordian.Securities Allocations & Payment Instructions.Headers.Total")}
          </StyledTableCell>
          <StyledTableCell
            align="right"
            classes={{
              head: classes.head,
            }}
          >
            {convertNumberToIntlFormat(totalAmount)}
          </StyledTableCell>
          <StyledTableCell
            align="right"
            classes={{
              head: classes.head,
            }}
          >
            {convertNumberToIntlFormat(totalShares)}
          </StyledTableCell>
        </StyledTableRow>
      );
    }
    return rows;
  };
  return (
    <StyledTableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell
              classes={{
                head: classes.head,
              }}
            >
              {t(
                "admission:Accordian.Securities Allocations & Payment Instructions.Headers.Client Account"
              )}
            </StyledTableCell>
            <StyledTableCell
              align="right"
              classes={{
                head: classes.head,
              }}
            >
              {t(
                "admission:Accordian.Securities Allocations & Payment Instructions.Headers.Pre-Allocation Amounts"
              )}
            </StyledTableCell>
            <StyledTableCell
              align="right"
              classes={{
                head: classes.head,
              }}
            >
              {t(
                "admission:Accordian.Securities Allocations & Payment Instructions.Headers.Certificates"
              )}
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>{subscriptions ? getRows(subscriptions) : ""}</TableBody>
      </Table>
    </StyledTableContainer>
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
