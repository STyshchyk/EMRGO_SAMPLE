import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SendIcon from "@mui/icons-material/Send";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Chip from "@mui/material/Chip";
import { amber, green, grey, lightBlue } from "@mui/material/colors";
import Dialog from "@mui/material/Dialog";
import MuiDialogContent from "@mui/material/DialogContent";
import MuiDialogTitle from "@mui/material/DialogTitle";
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
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import moment from "moment";

const DialogTitle = (props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle
      disableTypography
      sx={(theme) => ({
        margin: 0,
        padding: theme.spacing(2),
      })}
      {...other}
    >
      <Typography align="left" variant="h6">
        {children}
      </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          sx={(theme) => ({
            position: "absolute",
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
          })}
          onClick={onClose}
          size="large"
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
};

export const dateRenderer = (date, format = "DD/MM/YYYY") => {
  const inputDate = moment(date);
  let formattedDate = "NA";
  if (inputDate.isValid()) {
    formattedDate = inputDate.format(format);
  }
  return formattedDate;
};

export const DocHistory = ({ data }) => {
  const { t } = useTranslation(["documents"]);
  const { reviews, signers } = data;
  const [openHistoryModal, setOpenHistoryModal] = useState(false);

  const handleClose = () => {
    setOpenHistoryModal(false);
  };

  return (
    <Fragment>
      <IconButton aria-label="action" size="small" onClick={() => setOpenHistoryModal(true)}>
        <SupervisorAccountOutlinedIcon
          aria-controls="document-history"
          aria-haspopup="true"
          style={{ color: grey[700] }}
        />
      </IconButton>
      <Dialog
        maxWidth="md"
        fullWidth
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={openHistoryModal}
      >
        <DialogTitle onClose={handleClose}>
          {t("documents:History Modal.Document History")}
        </DialogTitle>
        <MuiDialogContent
          sx={(theme) => ({
            root: {
              padding: theme.spacing(2),
            },
          })}
          style={{ overflowY: "scroll", minHeight: "400px" }}
          dividers
        >
          <p>{t("documents:History Modal.Review History")}</p>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>{t("documents:History Modal.Headers.Name")}</TableCell>
                  <TableCell align="right">{t("documents:History Modal.Headers.Status")}</TableCell>
                  <TableCell align="right">
                    {t("documents:History Modal.Headers.Version")}
                  </TableCell>
                  <TableCell align="right">{t("documents:History Modal.Headers.Date")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reviews.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {`${row.reviewer.firstName || ""} ${row.reviewer.lastName || ""}`}
                    </TableCell>
                    <TableCell align="right">
                      {row.hasReviewed
                        ? t("documents:History Modal.Reviewed")
                        : t("documents:History Modal.In Review")}
                    </TableCell>
                    <TableCell align="right">{row.version}</TableCell>
                    <TableCell align="right">
                      {row.hasReviewed
                        ? dateRenderer(row.reviewEndDate, "DD/MM/YYYY h:mm a")
                        : dateRenderer(row.reviewStartDate, "DD/MM/YYYY h:mm a")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <p>{t("documents:History Modal.Signing History")}</p>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>{t("documents:History Modal.Headers.Name")}</TableCell>
                  <TableCell align="right">{t("documents:History Modal.Headers.Status")}</TableCell>
                  <TableCell align="right">
                    {t("documents:History Modal.Headers.Version")}
                  </TableCell>
                  <TableCell align="right">{t("documents:History Modal.Headers.Date")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {signers.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {`${row.signer.firstName || ""} ${row.signer.lastName || ""}`}
                    </TableCell>
                    <TableCell align="right">
                      {row.hasSigned
                        ? t("documents:History Modal.Signed")
                        : t("documents:History Modal.Signing")}
                    </TableCell>
                    <TableCell align="right">{row.version}</TableCell>
                    <TableCell align="right">
                      {row.hasSigned ? dateRenderer(row.signedDate, "DD/MM/YYYY h:mm a") : "--"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </MuiDialogContent>
      </Dialog>
    </Fragment>
  );
};

export const sharedRenderer = (value) => <DocHistory data={value} />;

const chipStyle = {
  borderRadius: "3px",
  textTransform: "uppercase",
  height: "20px",
  fontWeight: "700",
  fontSize: "0.7rem",
};

export const StatusRenderer = ({ value }) => {
  let bgColor = grey[300];
  let textColor = grey[800];
  switch (value) {
    case "signed":
      bgColor = green["100"];
      textColor = green["800"];
      break;
    case "ready":
      bgColor = lightBlue["100"];
      textColor = lightBlue["800"];
      break;
    case "review":
      bgColor = amber["100"];
      textColor = amber["800"];
      break;
    default:
      break;
  }
  const statusChip = (
    <Chip label={value} style={{ ...chipStyle, backgroundColor: bgColor, color: textColor }} />
  );
  return statusChip;
};

export const CategoryRenderer = ({ value }) => {
  const bgColor = grey[300];
  const textColor = grey[800];
  return (
    <Chip label={value} style={{ ...chipStyle, backgroundColor: bgColor, color: textColor }} />
  );
};

export const ActionMenu = ({ rowData }) => {
  const { t } = useTranslation(["documents"]);
  const [anchorEl, setAnchorEl] = useState(null);
  const {
    handlePreviewClick,
    handleUploadRevisionClick,
    handleRenameClick,
    handleDownloadClick,
    handleSendForReviewClick,
    handleSendForSigningClick,
    handleMarkAsExecutionVersionClick,
    handleDeleteClick,
    handleSigningClick,
  } = rowData;

  const previewDisabled = !handlePreviewClick;
  const downloadDisabled = !handleDownloadClick;
  const revisionDisabled = !handleUploadRevisionClick;
  const renameDisabled = !handleRenameClick;
  const sendForReviewDisabled = !handleSendForReviewClick;
  const sendForSigningDisabled = !handleSendForSigningClick;
  const markExecutionDisabled = !handleMarkAsExecutionVersionClick;
  const deleteDisabled = !handleDeleteClick;
  const signingDisabled = !handleSigningClick;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePreview = () => {
    handlePreviewClick();
    setAnchorEl(null);
  };

  const handleRename = () => {
    handleRenameClick();
    setAnchorEl(null);
  };

  const handleDownload = () => {
    handleDownloadClick();
    setAnchorEl(null);
  };

  const handleUploadRevision = () => {
    handleUploadRevisionClick();
    setAnchorEl(null);
  };

  const handleSendForReview = () => {
    handleSendForReviewClick();
    setAnchorEl(null);
  };

  const handleSendForSigning = () => {
    handleSendForSigningClick();
    setAnchorEl(null);
  };

  const handleMarkAsExecutionVersion = () => {
    handleMarkAsExecutionVersionClick();
    setAnchorEl(null);
  };

  const handleDelete = () => {
    handleDeleteClick();
    setAnchorEl(null);
  };

  const handleSigning = () => {
    handleSigningClick();
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
        <MenuItem disabled={previewDisabled} onClick={handlePreview} style={{ color: grey[700] }}>
          <ListItemIcon style={{ minWidth: "30px" }}>
            <DescriptionIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit" style={{ color: grey[800] }}>
            {t("documents:Context Menu.Preview")}
          </Typography>
        </MenuItem>
        <MenuItem disabled={downloadDisabled} onClick={handleDownload} style={{ color: grey[700] }}>
          <ListItemIcon style={{ minWidth: "30px" }}>
            <CloudDownloadIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit" style={{ color: grey[800] }}>
            {t("documents:Context Menu.Download")}
          </Typography>
        </MenuItem>
        <MenuItem disabled={renameDisabled} onClick={handleRename} style={{ color: grey[700] }}>
          <ListItemIcon style={{ minWidth: "30px" }}>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit" style={{ color: grey[800] }}>
            {t("documents:Context Menu.Rename")}
          </Typography>
        </MenuItem>
        <MenuItem
          disabled={revisionDisabled}
          onClick={handleUploadRevision}
          style={{ color: grey[700] }}
        >
          <ListItemIcon style={{ minWidth: "30px" }}>
            <CloudUploadIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit" style={{ color: grey[800] }}>
            {t("documents:Context Menu.Upload Revised Document")}
          </Typography>
        </MenuItem>
        <MenuItem
          disabled={sendForReviewDisabled}
          onClick={handleSendForReview}
          style={{ color: grey[700] }}
        >
          <ListItemIcon style={{ minWidth: "30px" }}>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit" style={{ color: grey[800] }}>
            {t("documents:Context Menu.Send for Review")}
          </Typography>
        </MenuItem>
        <MenuItem
          disabled={markExecutionDisabled}
          onClick={handleMarkAsExecutionVersion}
          style={{ color: grey[700] }}
        >
          <ListItemIcon style={{ minWidth: "30px" }}>
            <CheckIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit" style={{ color: grey[800] }}>
            {t("documents:Context Menu.Mark as Execution Version")}
          </Typography>
        </MenuItem>
        <MenuItem
          disabled={sendForSigningDisabled}
          onClick={handleSendForSigning}
          style={{ color: grey[700] }}
        >
          <ListItemIcon style={{ minWidth: "30px" }}>
            <SendIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit" style={{ color: grey[800] }}>
            {t("documents:Context Menu.Send for Signing")}
          </Typography>
        </MenuItem>
        <MenuItem disabled={signingDisabled} onClick={handleSigning} style={{ color: grey[700] }}>
          <ListItemIcon style={{ minWidth: "30px" }}>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit" style={{ color: grey[800] }}>
            {t("documents:Context Menu.Sign Document")}
          </Typography>
        </MenuItem>
        <MenuItem disabled={deleteDisabled} onClick={handleDelete} style={{ color: grey[700] }}>
          <ListItemIcon style={{ minWidth: "30px" }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit" style={{ color: grey[800] }}>
            {t("documents:Context Menu.Delete")}
          </Typography>
        </MenuItem>
      </Menu>
    </Fragment>
  );
};

export const actionRenderer = (rowData) => <ActionMenu rowData={rowData} />;

// {handleDownloadClick && (
//   <MenuItem onClick={handleDownload} style={{ color: grey[700] }}>
//     <ListItemIcon style={{ minWidth: '30px' }}>
//       <CloudDownloadIcon fontSize="small" />
//     </ListItemIcon>
//     <Typography variant="inherit" style={{ color: grey[800] }}>
//       Download
//     </Typography>
//   </MenuItem>
// )}
