import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

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

const ViewCounterpartySSIDialog = ({ data, open, handleClose, currentlySelectedRowData }) => {
  const transformCounterpartySSIData = (counterpartySSIData, counterpartyData) => {
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
      {
        label: "Counterparty",
        value: counterpartyData?.longName,
      },
      {
        label: "SSI Label",
        value: ssiLabel,
      },
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
        value: settlementLocation?.name,
      },
      {
        label: "Safe-keeping Account no.",
        value: safekeepingAccount ?? FALLBACK_VALUE,
      },
    ];
  };

  const transformedData = transformCounterpartySSIData(
    data?.counterpartySSIObject,
    data?.counterpartyObject
  );

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <StyledDialogHeader title="View Counterparty SSI" handleClose={handleClose} />
      <DialogContent>
        <Grid container justifyContent="center" alignItems="center">
          {transformedData.map(({ label, value }, index) => (
            <DataGridRow key={index} label={label} value={value} />
          ))}
        </Grid>
      </DialogContent>
      <DialogActions />
    </Dialog>
  );
};
export default ViewCounterpartySSIDialog;
