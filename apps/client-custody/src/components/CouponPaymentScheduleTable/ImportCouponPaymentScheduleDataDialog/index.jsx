import { useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";

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
import * as XLSX from "xlsx";

import { DEFAULT_DATE_FORMAT } from "../../../constants/datetime";

// !Dev notes: Disable an ability to import XLS file until XLS file validating logic is sorted

// const ALLOWED_FILE_TYPES = 'text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
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

  data.splice(0, 1);

  const resultingData = data
    .map((arrItem) => {
      if (arrItem.length === 3) {
        const [calenderDate, notional, coupon] = arrItem;

        if (!calenderDate || !notional || !coupon) return null;

        return {
          calenderDate: moment(calenderDate, "DD/MM/YYYY").toISOString(),
          notional: parseFloat(notional.replace(/,/g, "")),
          coupon: parseFloat(coupon),
        };
      }

      // TODO: Should throw an error if given CSV file is found to be invalid
      return null;
    })
    .filter((item) => {
      if (item) {
        // TODO: filter past dates?

        return true;
      }

      return false;
    });

  return resultingData;
};

const parseXLSXData = (binaryFile) => {
  let result;

  const workbook = XLSX.read(binaryFile, {
    type: "binary",
  });

  workbook.SheetNames.forEach((sheetName) => {
    // console.debug('DEBUG parseXLSXData sheetName: ', sheetName);
    const rowObject = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
    result = parseCsvData(rowObject);
    // console.debug('DEBUG parseXLSXData rowObject: ', rowObject);
    // console.debug('DEBUG parseXLSXData parsedCSV: ', JSON.stringify(result, null, 2));
  });

  return result;
};

const ImportCouponPaymentScheduleDataDialog = ({ open, handleClose, setTableData }) => {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const fileType = file.type;

    const isFileTypeCSV = fileType === "text/csv";
    const isFileTypeXLSX =
      fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    const reader = new FileReader();

    // reader.onabort = () => console.debug('DEBUG ImportFileDialog onDrop reading was aborted');
    // reader.onerror = () => console.debug('DEBUG ImportFileDialog onDrop reading has failed');

    reader.onload = () => {
      const fileData = reader.result;
      let parsed = [];

      if (isFileTypeCSV) {
        parsed = parseCsvData(fileData);
      }

      if (isFileTypeXLSX) {
        parsed = parseXLSXData(fileData);
      }

      setTableData(parsed); // overwrite existing table data with the value of parsed

      handleClose();
    };

    if (isFileTypeCSV) {
      reader.readAsText(file);
    }

    if (isFileTypeXLSX) {
      reader.readAsBinaryString(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept, isDragReject } =
    useDropzone({ onDrop, maxFiles: 1, accept: ALLOWED_FILE_TYPES });

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

export default ImportCouponPaymentScheduleDataDialog;

ImportCouponPaymentScheduleDataDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  setTableData: PropTypes.func.isRequired,
};
