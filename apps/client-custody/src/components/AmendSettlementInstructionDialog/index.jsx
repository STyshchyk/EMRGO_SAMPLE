import { useDispatch, useSelector } from "react-redux";

import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

import * as paymentAndSettlementActionCreators from "../../redux/actionCreators/paymentAndSettlement";
import * as entitiesSelectors from "../../redux/selectors/entities";
import * as paymentAndSettlementSelectors from "../../redux/selectors/paymentAndSettlement";
import RaiseSettlementInstructionForm, {
  buildRaiseSIRequestPayload,
} from "../RaiseSettlementInstructionForm";

const generateEntityOptionsList = (data) =>
  data
    .filter((i) => {
      const { groups } = i;

      return groups.some((j) => j.entityType === "INVESTOR");
    })
    .map((i) => ({
      label: i.corporateEntityName,
      value: i,
    }));

const generateInitialValues = (rowData) => ({
  counterpartySelectOption: {
    label: rowData?.counterpartyObject?.shortName,
    value: rowData?.counterpartyObject,
  },
  counterpartySSISelectOption: {
    label: rowData?.counterpartySSIObject?.ssiLabel,
    value: rowData?.counterpartySSIObject,
  },
  externalSecuritySelectOption: {
    label: rowData?.externalSecurity?.isin,
    value: rowData?.externalSecurity,
  },
  price: rowData?.price,
  // price: parseFloat(rowData?.price.replace(',', ''), 10),
  // quantity: parseInt(rowData?.quantity,10),
  quantity: parseFloat(rowData?.quantity.replace(",", ""), 10),
  settlementAmount: parseFloat(rowData?.settlementAmount.replace(",", ""), 10),
  settlementDate: new Date(rowData?.settlementDate),
  settlementTypeSelectOption: {
    label: rowData?.settlementType,
    value: rowData?.settlementTypeId,
  },
  tradeDate: new Date(rowData?.tradeDate),
  // new fields
  principalAmount: parseFloat(rowData?.principalAmount.replace(",", ""), 10),
  accruedInterest: parseFloat(rowData?.accruedInterest.replace(",", ""), 10),
  internalTradeRef: rowData?.internalTradeRef,
  entityGroup: rowData?.entityGroup,
  entityGroupId: rowData?.entityGroupId,
  userId: rowData?.userId,
});

const AmendSettlementInstructionDialog = ({ open, handleClose, currentlySelectedRowData }) => {
  const dispatch = useDispatch();
  const entities = useSelector(entitiesSelectors.selectEntities);

  // selectors
  const isSubmitting = useSelector(paymentAndSettlementSelectors.selectIsSubmitting);

  const generatedInitialValues = generateInitialValues(currentlySelectedRowData);

  const handleSubmit = (values) => {
    const updateSettlementInstruction = (payload) =>
      dispatch(paymentAndSettlementActionCreators.doUpdateSettlementInstruction(payload));
    const fetchPaymentsList = () =>
      dispatch(paymentAndSettlementActionCreators.doFetchPaymentsList());

    const requestPayload = buildRaiseSIRequestPayload(values);
    requestPayload.userId = currentlySelectedRowData?.userId;

    updateSettlementInstruction({
      settlementId: currentlySelectedRowData?.id,
      requestPayload,
      successCallback: () => {
        handleClose();
        fetchPaymentsList();
      },
    });
  };

  const entityOptionsList = generateEntityOptionsList(entities);

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
              Amend Settlement Instruction Form
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
          <RaiseSettlementInstructionForm
            options={{
              entityOptionsList,
            }}
            initialValues={generatedInitialValues}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            handleCloseDialog={() => handleClose()}
            editable
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

AmendSettlementInstructionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  currentlySelectedRowData: PropTypes.arrayOf(
    PropTypes.shape({
      counterpartyObject: PropTypes.shape,
      counterpartySSIObject: PropTypes.shape(),
      externalSecurity: PropTypes.shape,
      price: PropTypes.string,
      quantity: PropTypes.string,
      settlementAmount: PropTypes.string,
      settlementDate: PropTypes.string,
      settlementType: PropTypes.string,
      settlementTypeId: PropTypes.string,
      tradeDate: PropTypes.string,
      principalAmount: PropTypes.string,
      accruedInterest: PropTypes.string,
      internalTradeRef: PropTypes.string,
    })
  ).isRequired,
};

export default AmendSettlementInstructionDialog;
