import { useTranslation } from "react-i18next";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { DEFAULT_DATE_FORMAT, DEFAULT_DATE_TIME_FORMAT } from "../../constants/datetime";
import convertNumberToIntlFormat from "../../utils/convertNumberToIntlFormat";
import { dateFormatter } from "../../utils/formatter";
import StyledDialogHeader from "../StyledDialogHeader";

const FALLBACK_VALUE = "--";

const DataGridRow = ({ label, value }) => (
  <Grid container>
    <Grid item xs={6}>
      <Typography variant="subtitle1">{label}</Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography variant="subtitle1">{value}</Typography>
    </Grid>
  </Grid>
);

const ViewTradeDetailsDialog = ({ open, handleClose, currentlySelectedRowData }) => {
  const { t } = useTranslation(["custody_and_settlement"]);

  const transformCounterpartySSIData = (counterpartySSIData) => {
    if (!counterpartySSIData) return [];

    const {
      ssiLabel,
      counterparty,
      deliveryAgentIdentifier,
      sellerIdentifier,
      sellerIdentifierType,
      entity,
      settlementLocation,
      safekeepingAccount,
      deliveryAgentIdentifierType,
    } = counterpartySSIData;

    return [
      {
        label: "Entity",
        value: entity?.name,
      },
      //   {
      //     label: 'Counterparty',
      //     value: counterparty?.longName,
      //   },
      //   {
      //     label: 'SSI Label',
      //     value: ssiLabel,
      //   },
      {
        label: "Delivery Agent Identifier",
        value: deliveryAgentIdentifier,
      },
      {
        label: "Delivery Agent ID Type",
        value: deliveryAgentIdentifierType?.name,
      },
      {
        label: "Seller Agent Identifier",
        value: sellerIdentifier ?? FALLBACK_VALUE,
      },
      {
        label: "Seller Agent ID Type",
        value: sellerIdentifierType?.name ?? FALLBACK_VALUE,
      },
      {
        label: "Settlement Location",
        value: settlementLocation?.name ?? FALLBACK_VALUE,
      },
      {
        label: "Safe-keeping Account no.",
        value: safekeepingAccount ?? FALLBACK_VALUE,
      },
    ];
  };

  const transformTradeDetails = (tradeData) => {
    if (!tradeData) return [];

    const {
      referenceId,
      wsn,
      isin,
      internalTradeRef,
      security,
      securityTradeType,
      entryDate,
      tradeDate,
      settlementDate,
      issueDate,
      lastAmended,
      tradeSettlementOrSettlementInstructionStatus,
      currency,
      investorCashAccountNo,
      investorCashAccountBalance,
      investorSecuritiesAccountNo,
      investorSecuritiesAccountBalance,
      issuerCashAccountNo,
      issuerCashAccountBalance,
      issuerSecuritiesAccountNo,
      issuerSecuritiesAccountBalance,
      quantity,
      numCerts,
      issuer,
      investor,
      cashSSI,
      paymentEvidenceUploaded,
      settlementType,
      price,
      principalAmount,
      accruedInterest,
      settlementAmount,
      counterparty,
      counterpartySSI,
    } = tradeData;

    return [
      {
        label: t("Headers.Reference"),
        value: referenceId,
      },
      {
        label: "WSN",
        value: wsn,
      },
      {
        label: "ISIN",
        value: isin,
      },
      {
        label: t("Headers.Internal Trade Ref"),
        value: internalTradeRef,
      },
      {
        label: t("Headers.Security"),
        value: security,
      },
      {
        label: t("Headers.Trade Type"),
        value: securityTradeType,
      },
      {
        label: t("Headers.Entry Date"),
        value: dateFormatter(entryDate, DEFAULT_DATE_TIME_FORMAT),
      },
      {
        label: t("Headers.Trade Date"),
        value: dateFormatter(tradeDate, DEFAULT_DATE_FORMAT),
      },
      {
        label: t("Headers.Settlement Date"),
        value: dateFormatter(settlementDate, DEFAULT_DATE_FORMAT),
      },
      {
        label: t("Headers.Value Date"),
        value: dateFormatter(issueDate, DEFAULT_DATE_FORMAT),
      },
      {
        label: t("Headers.Last Amended"),
        value: dateFormatter(lastAmended, DEFAULT_DATE_TIME_FORMAT),
      },
      {
        label: t("Headers.Settlement Status"),
        value: tradeSettlementOrSettlementInstructionStatus ?? FALLBACK_VALUE,
      },
      {
        label: "CCY",
        value: currency,
      },
      {
        label: t("Headers.Inv Cash Acc No"),
        value: investorCashAccountNo,
      },
      {
        label: t("Headers.Inv Cash Acc Bal"),
        value: investorCashAccountBalance,
      },
      {
        label: t("Headers.Inv Sec Acc No"),
        value: investorSecuritiesAccountNo,
      },
      {
        label: t("Headers.Inv Sec Acc Bal"),
        value: investorSecuritiesAccountBalance,
      },
      {
        label: t("Headers.Iss Cash Acc No"),
        value: issuerCashAccountNo ?? FALLBACK_VALUE,
      },
      {
        label: t("Headers.Iss Cash Acc Bal"),
        value: issuerCashAccountBalance ?? FALLBACK_VALUE,
      },
      {
        label: t("Headers.Iss Sec Acc No"),
        value:
          (issuerSecuritiesAccountNo && convertNumberToIntlFormat(issuerSecuritiesAccountNo)) ||
          FALLBACK_VALUE,
      },
      {
        label: t("Headers.Iss Sec Acc Bal"),
        value:
          (issuerSecuritiesAccountBalance &&
            convertNumberToIntlFormat(issuerSecuritiesAccountBalance)) ||
          FALLBACK_VALUE,
      },
      {
        label: t("Headers.Qty"),
        value: quantity,
      },
      {
        label: t("Headers.Num Certs"),
        value: numCerts,
      },
      {
        label: t("Headers.Issuer"),
        value: issuer ?? FALLBACK_VALUE,
      },
      {
        label: t("Headers.Investor"),
        value: investor ?? FALLBACK_VALUE,
      },
      {
        label: t("Headers.Cash SSI"),
        value: cashSSI,
      },
      {
        label: t("Headers.Evidence Uploaded"),
        value: paymentEvidenceUploaded ? "Yes" : "No",
      },
      {
        label: t("Headers.Settle Type"),
        value: settlementType,
      },
      {
        label: t("Headers.Price"),
        value: price,
      },
      {
        label: t("Headers.Principal Amount"),
        value: principalAmount,
      },
      {
        label: t("Headers.Accrued Interest"),
        value: accruedInterest,
      },
      {
        label: t("Headers.Settle Amount"),
        value: settlementAmount,
      },
      {
        label: t("Headers.Cpty"),
        value: counterparty,
      },
      {
        label: t("Headers.Cpty SSI"),
        value: counterpartySSI,
      },
    ];
  };

  const transformedSSIData = transformCounterpartySSIData(
    currentlySelectedRowData?.counterpartySSIObject
  );
  const transformedTradeData = transformTradeDetails(currentlySelectedRowData);

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <StyledDialogHeader title="View Trade Details" handleClose={handleClose} />
      <DialogContent>
        <Grid container justifyContent="center" alignItems="center">
          {transformedTradeData.map(({ label, value }, index) => (
            <DataGridRow key={index} label={label} value={value} />
          ))}
        </Grid>

        <Grid container justifyContent="center" alignItems="center">
          {transformedSSIData.map(({ label, value }, index) => (
            <DataGridRow key={index} label={label} value={value} />
          ))}
        </Grid>
      </DialogContent>
      <DialogActions />
    </Dialog>
  );
};
export default ViewTradeDetailsDialog;
