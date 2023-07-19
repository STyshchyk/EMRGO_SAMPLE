import { useState, Fragment } from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
// import { titleCase } from 'change-case';

import Chip from '@material-ui/core/Chip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import grey from '@material-ui/core/colors/grey';
import lightBlue from '@material-ui/core/colors/lightBlue';

import SupervisorAccountOutlinedIcon from '@material-ui/icons/SupervisorAccountOutlined';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import SendIcon from '@material-ui/icons/Send';
import DeleteIcon from '@material-ui/icons/Delete';
import DescriptionIcon from '@material-ui/icons/Description';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles, makeStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography align="left" variant="h6">
        {children}
      </Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export const dateRenderer = (date, format = 'DD/MM/YYYY') => {
  const inputDate = moment(date);
  let formattedDate = 'NA';
  if (inputDate.isValid()) {
    formattedDate = inputDate.format(format);
  }
  return formattedDate;
};

export const DocHistory = ({ data }) => {
  const { t } = useTranslation(['documents']);
  const { reviews, signers } = data;
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const classes = useStyles();

  const handleClose = () => {
    setOpenHistoryModal(false);
  };

  return (
    <Fragment>
      <IconButton aria-label="action" size="small" onClick={() => setOpenHistoryModal(true)}>
        <SupervisorAccountOutlinedIcon aria-controls="document-history" aria-haspopup="true" style={{ color: grey[700] }} />
      </IconButton>
      <Dialog maxWidth="md" fullWidth onClose={handleClose} aria-labelledby="customized-dialog-title" open={openHistoryModal}>
        <DialogTitle onClose={handleClose}>{t('documents:History Modal.Document History')}</DialogTitle>
        <DialogContent style={{ overflowY: 'scroll', minHeight: '400px' }} dividers>
          <p>{t('documents:History Modal.Review History')}</p>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>{t('documents:History Modal.Headers.Name')}</TableCell>
                  <TableCell align="right">{t('documents:History Modal.Headers.Status')}</TableCell>
                  <TableCell align="right">{t('documents:History Modal.Headers.Version')}</TableCell>
                  <TableCell align="right">{t('documents:History Modal.Headers.Date')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reviews.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {`${row.reviewer.firstName || ''} ${row.reviewer.lastName || ''}`}
                    </TableCell>
                    <TableCell align="right">{row.hasReviewed ? t('documents:History Modal.Reviewed') : t('documents:History Modal.In Review')}</TableCell>
                    <TableCell align="right">{row.version}</TableCell>
                    <TableCell align="right">{row.hasReviewed ? dateRenderer(row.reviewEndDate, 'DD/MM/YYYY h:mm a') : dateRenderer(row.reviewStartDate, 'DD/MM/YYYY h:mm a')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <p>{t('documents:History Modal.Signing History')}</p>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>{t('documents:History Modal.Headers.Name')}</TableCell>
                  <TableCell align="right">{t('documents:History Modal.Headers.Status')}</TableCell>
                  <TableCell align="right">{t('documents:History Modal.Headers.Version')}</TableCell>
                  <TableCell align="right">{t('documents:History Modal.Headers.Date')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {signers.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {`${row.signer.firstName || ''} ${row.signer.lastName || ''}`}
                    </TableCell>
                    <TableCell align="right">{row.hasSigned ? t('documents:History Modal.Signed') : t('documents:History Modal.Signing')}</TableCell>
                    <TableCell align="right">{row.version}</TableCell>
                    <TableCell align="right">{row.hasSigned ? dateRenderer(row.signedDate, 'DD/MM/YYYY h:mm a') : '--'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export const sharedRenderer = (value) => <DocHistory data={value} />;

const chipStyle = {
  borderRadius: '3px',
  textTransform: 'uppercase',
  height: '20px',
  fontWeight: '700',
  fontSize: '0.7rem',
};

export const StatusRenderer = ({ value }) => {
  let bgColor = grey[300];
  let textColor = grey[800];
  switch (value) {
    case 'signed':
      bgColor = green['100'];
      textColor = green['800'];
      break;
    case 'ready':
      bgColor = lightBlue['100'];
      textColor = lightBlue['800'];
      break;
    case 'review':
      bgColor = amber['100'];
      textColor = amber['800'];
      break;
    default:
      break;
  }
  const statusChip = <Chip label={value} style={{ ...chipStyle, backgroundColor: bgColor, color: textColor }} />;
  return statusChip;
};

export const CategoryRenderer = ({ value }) => {
  const bgColor = grey[300];
  const textColor = grey[800];
  return <Chip label={value} style={{ ...chipStyle, backgroundColor: bgColor, color: textColor }} />;
};

export const ActionMenu = ({ rowData }) => {
  const { t } = useTranslation(['documents']);
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
        <MoreVertIcon aria-controls="simple-menu" aria-haspopup="true" style={{ color: grey[700] }} />
      </IconButton>

      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem disabled={previewDisabled} onClick={handlePreview} style={{ color: grey[700] }}>
          <ListItemIcon style={{ minWidth: '30px' }}>
            <DescriptionIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit" style={{ color: grey[800] }}>
            {t('documents:Context Menu.Preview')}
          </Typography>
        </MenuItem>
        <MenuItem disabled={downloadDisabled} onClick={handleDownload} style={{ color: grey[700] }}>
          <ListItemIcon style={{ minWidth: '30px' }}>
            <CloudDownloadIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit" style={{ color: grey[800] }}>
            {t('documents:Context Menu.Download')}
          </Typography>
        </MenuItem>
        <MenuItem disabled={renameDisabled} onClick={handleRename} style={{ color: grey[700] }}>
          <ListItemIcon style={{ minWidth: '30px' }}>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit" style={{ color: grey[800] }}>
            {t('documents:Context Menu.Rename')}
          </Typography>
        </MenuItem>
        <MenuItem disabled={revisionDisabled} onClick={handleUploadRevision} style={{ color: grey[700] }}>
          <ListItemIcon style={{ minWidth: '30px' }}>
            <CloudUploadIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit" style={{ color: grey[800] }}>
            {t('documents:Context Menu.Upload Revised Document')}
          </Typography>
        </MenuItem>
        <MenuItem disabled={sendForReviewDisabled} onClick={handleSendForReview} style={{ color: grey[700] }}>
          <ListItemIcon style={{ minWidth: '30px' }}>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit" style={{ color: grey[800] }}>
            {t('documents:Context Menu.Send for Review')}
          </Typography>
        </MenuItem>
        <MenuItem disabled={markExecutionDisabled} onClick={handleMarkAsExecutionVersion} style={{ color: grey[700] }}>
          <ListItemIcon style={{ minWidth: '30px' }}>
            <CheckIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit" style={{ color: grey[800] }}>
            {t('documents:Context Menu.Mark as Execution Version')}
          </Typography>
        </MenuItem>
        <MenuItem disabled={sendForSigningDisabled} onClick={handleSendForSigning} style={{ color: grey[700] }}>
          <ListItemIcon style={{ minWidth: '30px' }}>
            <SendIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit" style={{ color: grey[800] }}>
            {t('documents:Context Menu.Send for Signing')}
          </Typography>
        </MenuItem>
        <MenuItem disabled={signingDisabled} onClick={handleSigning} style={{ color: grey[700] }}>
          <ListItemIcon style={{ minWidth: '30px' }}>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit" style={{ color: grey[800] }}>
            {t('documents:Context Menu.Sign Document')}
          </Typography>
        </MenuItem>
        <MenuItem disabled={deleteDisabled} onClick={handleDelete} style={{ color: grey[700] }}>
          <ListItemIcon style={{ minWidth: '30px' }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit" style={{ color: grey[800] }}>
            {t('documents:Context Menu.Delete')}
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
