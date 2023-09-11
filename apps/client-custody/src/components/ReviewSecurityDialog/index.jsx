import { Fragment, useRef } from "react";
import { useTranslation } from "react-i18next";

import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { CsvBuilder } from "filefy";
import PropTypes from "prop-types";

import { DEFAULT_DATE_FORMAT } from "../../constants/datetime";
import { roundNumber } from "../../helpers/renderers";
import convertNumberToIntlFormat from "../../utils/convertNumberToIntlFormat";
import { dateFormatter } from "../../utils/formatter";
import ReportingPDFExporter from "../ReportingPDFExporter";
import StyledDialogHeader from "../StyledDialogHeader";

const primary = "#23389c";

const pdfStyles = StyleSheet.create({
  label: { fontSize: "10px", fontFamily: "D-DIN Exp", color: primary, marginTop: "5px" },
  value: { fontSize: "10px", fontFamily: "D-DIN Exp", fontWeight: 700, color: primary },
  labelWrapper: { minWidth: "250px" },
  block: { flexDirection: "row" },
});

const SecurityInfoDataGridRow = ({ label, value }) => (
  <Grid container>
    <Grid item xs={6}>
      <Typography variant="subtitle1">{label}</Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography variant="subtitle1">{value}</Typography>
    </Grid>
  </Grid>
);

const ReviewSecurityDialog = ({ data, open, handleClose }) => {
  const ref = useRef();
  const { t } = useTranslation(["termsheet"]);

  const transformSecurityData = (securityData) => {
    if (!securityData) return {};

    const {
      countryOfRisk, // ???
      country, // ???
      currencyName,
      denominationName,
      frequencyName,
      isin,
      issuanceAmount,
      issuanceName,
      issueDate,
      maturityDate,
      profitRate,
      securityLongName,
      securityShortName,
      longName,
      shortName,
      ticker,
      wsn,
    } = securityData;

    return {
      denominationName: {
        label: t("Denomination"),
        value: denominationName?.name,
      },
      profitRate: {
        label: t("Profit Rate"),
        value: roundNumber(profitRate, 4),
      },
      frequencyName: {
        label: t("Frequency"),
        value: frequencyName?.name,
      },
      wsn: {
        label: "WSN",
        value: wsn,
      },
      isin: {
        label: "ISIN",
        value: isin,
      },
      ticker: {
        label: t("Ticker"),
        value: ticker,
      },
      countryOfRisk: {
        label: t("Country of Risk"),
        value: countryOfRisk || country?.name,
      },
      issuanceName: {
        label: t("Issuance Name"),
        value: issuanceName,
      },
      securityLongName: {
        label: t("Security Long Name"),
        value: securityLongName || longName, // !Dev note: certain Wethaq API field names are not always used consistently ¯\_(ツ)_/¯
      },
      securityShortName: {
        label: t("Security Short Name"),
        value: securityShortName || shortName, // !Dev note: certain Wethaq API field names are not always used consistently ¯\_(ツ)_/¯
      },
      issuanceAmount: {
        label: t("Issuance Amount"),
        value: convertNumberToIntlFormat(issuanceAmount),
      },
      currencyName: {
        label: t("Currency"),
        value: currencyName?.name,
      },
      maturityDate: {
        label: t("Maturity Date"),
        value: dateFormatter(maturityDate, DEFAULT_DATE_FORMAT),
      },
      issueDate: {
        label: t("Issue Date"),
        value: dateFormatter(issueDate, DEFAULT_DATE_FORMAT),
      },
    };
  };

  const transformedSecurityData = transformSecurityData(data);

  const handleClickDownloadCSVButton = () => {
    const generatedAtTimestamp = new Date().toISOString();
    const csvFileName = `${data.issuanceName}_securities_info_${generatedAtTimestamp}.csv`;
    const listOfColumnNames = [];
    const listOfRowValues = [];

    Object.entries(transformedSecurityData).forEach(([, { label, value }]) => {
      listOfColumnNames.push(label);
      listOfRowValues.push(value);
    });

    const csvBuilder = new CsvBuilder(csvFileName)
      .setColumns(listOfColumnNames)
      .addRows([listOfRowValues]);

    csvBuilder.exportFile();
  };

  const handleClickDownloadPDFButton = () => {
    ref.current.exportFile();
  };

  return (
    <Fragment>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <StyledDialogHeader title={"Security Information"} handleClose={handleClose} />
        <DialogContent>
          <Grid container justifyContent="center" alignItems="center">
            {Object.entries(transformedSecurityData).map(([key, { label, value }]) => (
              <SecurityInfoDataGridRow key={key} label={label} value={value} />
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            startIcon={<CloudDownloadIcon />}
            onClick={handleClickDownloadCSVButton}
            color="primary"
          >
            <strong>CSV</strong>
          </Button>
          <Button
            variant="contained"
            startIcon={<CloudDownloadIcon />}
            onClick={handleClickDownloadPDFButton}
            color="primary"
          >
            <strong>PDF</strong>
          </Button>
        </DialogActions>
      </Dialog>

      <ReportingPDFExporter ref={ref} title="Security Information">
        {transformedSecurityData &&
          Object.entries(transformedSecurityData).map(([, { label, value }]) => (
            <View style={pdfStyles.block}>
              <View style={pdfStyles.labelWrapper}>
                <Text style={pdfStyles.label} key={label}>
                  {label}
                </Text>
              </View>
              <Text style={pdfStyles.value}>{value}</Text>
            </View>
          ))}
      </ReportingPDFExporter>
    </Fragment>
  );
};

export default ReviewSecurityDialog;

ReviewSecurityDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.shape({
    countryOfRisk: PropTypes.string.isRequired,
    currencyName: PropTypes.string.isRequired,
    denominationName: PropTypes.string.isRequired,
    frequencyName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    isin: PropTypes.string.isRequired,
    issuanceAmount: PropTypes.string.isRequired,
    issuanceName: PropTypes.string.isRequired,
    issueDate: PropTypes.string.isRequired,
    maturityDate: PropTypes.string.isRequired,
    profitRate: PropTypes.string.isRequired,
    securityLongName: PropTypes.string.isRequired,
    securityShortName: PropTypes.string.isRequired,
    ticker: PropTypes.string.isRequired,
    wsn: PropTypes.string.isRequired,
  }).isRequired,
};
