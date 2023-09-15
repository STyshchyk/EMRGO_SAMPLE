import { useDispatch, useSelector } from "react-redux";

import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import * as journalsActionCreators from "../../redux/actionCreators/journals";
import * as billingAndPaymentsSelectors from "../../redux/selectors/cashManagement";
import * as paymentAndSettlementSelectors from "../../redux/selectors/paymentAndSettlement";
import AddInternalTransferForm, {
  generateEntityOptionsList,
  generateWethaqAccountOptionsList,
} from "../AddInternalTransferForm";

const generateInitialValues = (rowData) => ({
  sourceEntity: null,
  sourceAccount: null,
  destinationEntity: null,
  destinationAccount: null,
  transferAmount: rowData?.transferAmount,
  description: rowData?.description,
});

const AmendInternalTransferDialog = ({ open, handleClose, currentlySelectedRowData }) => {
  const dispatch = useDispatch();

  // selectors
  const isSubmitting = useSelector(paymentAndSettlementSelectors.selectIsSubmitting);
  const generatedInitialValues = generateInitialValues(currentlySelectedRowData);
  const sourceOwners = useSelector(billingAndPaymentsSelectors.selectSourceOwners);
  const destinationOwners = useSelector(billingAndPaymentsSelectors.selectDestinationOwners);
  const sourceAccounts = useSelector(billingAndPaymentsSelectors.selectSourceAccounts);
  const destinationAccounts = useSelector(billingAndPaymentsSelectors.selectDestinationAccounts);

  const sourceEntitiesDropdown = generateEntityOptionsList(sourceOwners);
  const destinationEntitiesDropdown = generateEntityOptionsList(destinationOwners);
  const sourceAccountsDropdown = generateWethaqAccountOptionsList(sourceAccounts);
  const destinationAccountsDropdown = generateWethaqAccountOptionsList(destinationAccounts);

  generatedInitialValues.sourceEntity = sourceEntitiesDropdown.find(
    ({ value }) => currentlySelectedRowData?.sourceEntityId === value
  );
  generatedInitialValues.destinationEntity = destinationEntitiesDropdown.find(
    ({ value }) => currentlySelectedRowData?.destinationEntityId === value
  );
  generatedInitialValues.sourceAccount = sourceAccountsDropdown.find(
    ({ label }) => currentlySelectedRowData?.sourceAccountNumber === label
  );
  generatedInitialValues.destinationAccount = destinationAccountsDropdown.find(
    ({ label }) => currentlySelectedRowData?.destinationAccountNumber === label
  );

  const handleSubmit = (values) => {
    const updateInternalJournal = (payload) =>
      dispatch(journalsActionCreators.doUpdateInternalTransactions(payload));
    const fetchInternalTransactions = () =>
      dispatch(journalsActionCreators.doFetchInternalTransactions());

    const requestPayload = {
      amount: parseFloat(values.transferAmount),
      description: values.description,
      sourceAccountId: values.sourceAccount?.value.accountId,
      destinationAccountId: values.destinationAccount?.value.accountId,
    };

    // const requestPayload = buildAddInternalTransferRequestPayload(values);
    // requestPayload.userId = currentlySelectedRowData?.userId;

    updateInternalJournal({
      journalId: currentlySelectedRowData.id,
      requestPayload,
      successCallback: () => {
        handleClose();
        fetchInternalTransactions();
      },
    });
  };

  return (
    <Dialog
      disableEscapeKeyDown
      open={open}
      onClose={(event, reason) => {
        if (reason && reason === "backdropClick") return;

        handleClose();
      }}
      aria-labelledby="amend-settlement-instruction-form-dialog"
    >
      <DialogTitle>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography
              variant="h6"
              style={{
                fontWeight: "bold",
              }}
            >
              Amend Internal Transfer Form
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
        <Box mb={2}>
          <AddInternalTransferForm
            initialValues={generatedInitialValues}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            handleCloseDialog={() => handleClose()}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AmendInternalTransferDialog;
