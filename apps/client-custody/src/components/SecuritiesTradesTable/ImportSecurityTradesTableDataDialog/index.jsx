import { useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";

import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import moment from "moment";
import { parse } from "papaparse";
import PropTypes from "prop-types";

import { DEFAULT_DATE_FORMAT } from "../../../constants/datetime";

const ALLOWED_FILE_TYPES = "text/csv";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "10px",
  borderWidth: 1,
  borderRadius: 0,
  borderColor: "#02075d",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#02075d",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const parseCsvData = (csvString) => {
  const { data } = parse(csvString);
  // 04/10/2022 12:18:15

  // const datetime = '04/10/2022 12:18:15';
  // const res1 = moment(datetime, 'DD/MM/YYYY HH:mm:ss');
  // const res2 = res1.toISOString();

  data.splice(0, 1);
  const resultingData = data
    .map((arrItem) => {
      if (arrItem.length === 13) {
        const [
          settlementType,
          isin,
          currency,
          tradeDate,
          settlementDate,
          quantity,
          price,
          principalAmount,
          accruedInterest,
          settlementAmount,
          counterparty,
          counterpartySSI,
          internalTradeRef,
        ] = arrItem;

        // if (!settlementType || !isin || !currency || !internalTradeRef) return null;

        return {
          settlementType,
          isin,
          currency,
          tradeDate: moment(tradeDate, "DD/MM/YYYY").toISOString(),
          settlementDate: moment(settlementDate, "DD/MM/YYYY").toISOString(),
          quantity,
          price,
          principalAmount,
          accruedInterest,
          settlementAmount,
          counterparty,
          counterpartySSI,
          internalTradeRef,
        };
      }

      return null;
    })
    .filter((item) => {
      if (item) {
        return true;
      }

      return false;
    });

  return resultingData;
};

const ImportSecurityTradesTableDataDialog = ({
  open,
  handleClose,
  setTableData,
  tableData,
  setHasImportedData,
}) => {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const fileType = file.type;

    const isFileTypeCSV = fileType === "text/csv";

    const reader = new FileReader();

    reader.onload = () => {
      const fileData = reader.result;
      let parsed = [];

      if (isFileTypeCSV) {
        parsed = parseCsvData(fileData);
      }

      if (!parsed.length) {
        toast.error("CSV file has no data or is invalid");
        handleClose();
        return;
      }

      setHasImportedData(true);
      setTableData([...parsed, ...tableData]);

      handleClose();
    };

    if (isFileTypeCSV) {
      reader.readAsText(file);
    }
  }, []);

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: ALLOWED_FILE_TYPES,
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const placeholderText = "Drag 'n' drop some file here, or click to select file.";

  return (
    <Dialog
      disableEscapeKeyDown
      maxWidth="sm"
      open={open}
      onClose={(event, reason) => {
        if (reason && reason === "backdropClick") return;

        handleClose();
      }}
      aria-labelledby="form-dialog-title"
      sty
    >
      <DialogTitle>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Typography
              variant="h6"
              style={{
                fontWeight: "bold",
              }}
            >
              Import CSV File
            </Typography>
          </Grid>
          <Grid item>
            <IconButton
              aria-label="close"
              onClick={() => {
                handleClose();
              }}
              size="large"
            >
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>

      <DialogContent>
        <div {...getRootProps({ style })}>
          <input {...getInputProps()} />
          <p>{placeholderText}</p>
        </div>

        <Grid container direction="column">
          <div
            style={{
              marginTop: "1rem",
            }}
          >
            <Grid item>
              <Typography variant="button">
                <strong>ACCEPTABLE DATE FORMAT: </strong>
                {`${DEFAULT_DATE_FORMAT}`}
              </Typography>
            </Grid>
          </div>
        </Grid>
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
};

export default ImportSecurityTradesTableDataDialog;

ImportSecurityTradesTableDataDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  setTableData: PropTypes.func.isRequired,
};
