import { Fragment, useState } from "react";
import { styled } from '@mui/material/styles';
import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import PropTypes from "prop-types";

import {
  ActionMenu,
  CategoryRenderer,
  dateRenderer,
  DocHistory,
  StatusRenderer,
} from "../../constants/documents/renderers";
import LoadingIndicator from "../LoadingIndicator";

const PREFIX = 'FileTable';

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

function FileTableHead() {
  const { t } = useTranslation(["documents"]);

  const headCells = [
    { id: "name", label: t("documents:Headers.Document Name") },
    { id: "shared", label: t("documents:Headers.Shared") },
    { id: "version", label: t("documents:Headers.Version") },
    { id: "status", label: t("documents:Headers.Status") },
    { id: "issuance", label: t("documents:Headers.Issuance") },
    { id: "category", label: t("documents:Headers.Category") },
    { id: "uploaded_by", label: t("documents:Headers.Uploaded By") },
    { id: "uploaded", label: t("documents:Headers.Date Uploaded") },
    { id: "modified", label: t("documents:Headers.Date Modified") },
  ];

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align="left" padding="normal">
            {headCell.label}
          </TableCell>
        ))}
        <TableCell padding="checkbox">{t("documents:Headers.Actions")}</TableCell>
      </TableRow>
    </TableHead>
  );
}

function Row(props) {
  const { t } = useTranslation(["documents", "statuses"]);
  const { row } = props;
  // const [open, setOpen] = React.useState(false);

  return (
    <Fragment>
      <TableRow hover role="checkbox" tabIndex={-1}>
        <TableCell component="th" scope="row" padding="normal">
          {row.name}
        </TableCell>
        <TableCell>
          <DocHistory data={row.shared} />
        </TableCell>
        <TableCell>{row.version}</TableCell>
        <TableCell>
          <StatusRenderer value={t(`statuses:Documents.${row.status}`)} />
        </TableCell>
        <TableCell>{row.issuance}</TableCell>
        <TableCell>
          <CategoryRenderer value={t(`documents:${row.category.split("_").join(" ")}`)} />
        </TableCell>
        <TableCell>{row.uploadedby}</TableCell>
        <TableCell>{dateRenderer(row.dateUploaded)}</TableCell>
        <TableCell>{dateRenderer(row.dateModified)}</TableCell>
        <TableCell padding="checkbox">
          <ActionMenu rowData={row.actions} />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={false} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <p>{t("documents:Expanded View")}</p>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    name: PropTypes.string,
    shared: PropTypes.string,
    version: PropTypes.string,
    status: PropTypes.string,
    issuance: PropTypes.string,
    uploadedby: PropTypes.string,
    category: PropTypes.array,
    dateUploaded: PropTypes.string,
    dateModified: PropTypes.string,
    actions: PropTypes.array,
  }).isRequired,
};

Row.defaultProps = {};

export default function FileTable({ data, loading }) {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { t } = useTranslation(["documents"]);

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
            aria-labelledby=""
            size="medium"
            aria-label="files table"
          >
            <FileTableHead classes={classes} rowCount={data.length} />
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
        <div>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            labelRowsPerPage={t("documents:Rows per page")}
            labelDisplayedRows={({ from, to, count }) =>
              `${from} - ${to} ${t("documents:of")} ${count}`
            }
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </Paper>
    </Root>
  );
}

FileTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool.isRequired,
};

FileTable.defaultProps = {};
