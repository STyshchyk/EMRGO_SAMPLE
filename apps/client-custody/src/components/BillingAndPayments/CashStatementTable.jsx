import { Fragment, useState } from "react";
import { styled } from '@mui/material/styles';
// import PropTypes from 'prop-types';
import { useTranslation } from "react-i18next";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { grey } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import LoadingIndicator from "../LoadingIndicator";

const PREFIX = 'ActionMenu';

const classes = {
  root: `${PREFIX}-root`,
  paper: `${PREFIX}-paper`,
  table: `${PREFIX}-table`,
  visuallyHidden: `${PREFIX}-visuallyHidden`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`&.${classes.root}`]: {
    width: "100%",
  },

  [`& .${classes.paper}`]: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },

  [`& .${classes.table}`]: {
    minWidth: 750,
  },

  [`& .${classes.visuallyHidden}`]: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  }
}));

export const ActionMenu = ({ rowData }) => {
  const { t } = useTranslation(["cash_management"]);
  const [anchorEl, setAnchorEl] = useState(null);
  const { handleDeleteClick, handleEditClick } = rowData;

  const deleteDisabled = !handleDeleteClick;
  const editDisabled = !handleEditClick;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleEditClick();
    setAnchorEl(null);
  };

  const handleDelete = () => {
    handleDeleteClick();
    setAnchorEl(null);
  };

  return (
    <Fragment>
      <IconButton aria-label="action" size="small" onClick={handleClick}>
        <MoreVertIcon
          aria-controls="simple-menu"
          aria-haspopup="true"
          style={{ color: grey[700] }}
        />
      </IconButton>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem disabled={editDisabled} onClick={handleEdit} style={{ color: grey[700] }}>
          <ListItemIcon style={{ minWidth: "30px" }}>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit" style={{ color: grey[800] }}>
            {t("cash_management:Context Menu.Edit")}
          </Typography>
        </MenuItem>
        <MenuItem disabled={deleteDisabled} onClick={handleDelete} style={{ color: grey[700] }}>
          <ListItemIcon style={{ minWidth: "30px" }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit" style={{ color: grey[800] }}>
            {t("cash_management:Context Menu.Delete")}
          </Typography>
        </MenuItem>
      </Menu>
    </Fragment>
  );
};

function CashStatementTableHead() {
  const { t } = useTranslation(["cash_management"]);

  const headCells = [
    { id: "date", label: t("cash_management:Cash Statement.Headers.Date") },
    {
      id: "transactionType",
      label: t("cash_management:Cash Statement.Headers.Transaction_Balance Type"),
    },
    { id: "refNo", label: t("cash_management:Cash Statement.Headers.Reference No") },
    { id: "isin", label: t("cash_management:Cash Statement.Headers.Related ISIN") },
    { id: "narrative", label: t("cash_management:Cash Statement.Headers.Narrative") },
    { id: "debit", label: t("cash_management:Cash Statement.Headers.Debit") },
    { id: "credit", label: t("cash_management:Cash Statement.Headers.Credit") },
    { id: "balance", label: t("cash_management:Cash Statement.Headers.Balance") },
  ];

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align="left" padding="normal">
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function Row(props) {
  // const { t } = useTranslation(['cash_management']);
  const { row } = props;
  // const [open, setOpen] = React.useState(false);

  return (
    <Fragment>
      <TableRow hover role="checkbox" tabIndex={-1}>
        <TableCell>{row.date}</TableCell>
        <TableCell>{row.transactionType}</TableCell>
        <TableCell>{row.refNo}</TableCell>
        <TableCell>{row.isin}</TableCell>
        <TableCell>{row.narrative}</TableCell>
        <TableCell>{row.debit}</TableCell>
        <TableCell>{row.credit}</TableCell>
        <TableCell>{row.balance}</TableCell>
      </TableRow>
    </Fragment>
  );
}

export default function CashStatementTable({ data, loading }) {

  const { t } = useTranslation(["cash_management"]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

  return (
    <Root className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="Files"
            size="medium"
            aria-label="files table"
          >
            <CashStatementTableHead classes={classes} rowCount={data.length} />
            {loading ? (
              <TableBody>
                <TableRow style={{ height: 73 * rowsPerPage }}>
                  <TableCell colSpan={10}>
                    <LoadingIndicator />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <Row key={row.id} row={row} index={index} />
                  ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 73 * emptyRows }}>
                    <TableCell colSpan={10} />
                  </TableRow>
                )}
              </TableBody>
            )}
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          labelRowsPerPage={t("cash_management:Rows per page")}
          labelDisplayedRows={({ from, to, count }) =>
            `${from} - ${to} ${t("cash_management:of")} ${count}`
          }
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Root>
  );
}
