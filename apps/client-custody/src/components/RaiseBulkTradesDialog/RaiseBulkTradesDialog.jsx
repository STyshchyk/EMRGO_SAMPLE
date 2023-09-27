import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import * as paymentAndSettlementActionCreators from "../../redux/actionCreators/paymentAndSettlement";
import * as counterpartySelectors from "../../redux/selectors/counterparty";
import * as dropdownSelectors from "../../redux/selectors/dropdown";
import * as externalSecuritiesSelectors from "../../redux/selectors/externalSecurities";

const RaiseBulkTradesDialog = ({ open, handleClose, tableData }) => {
  const dispatch = useDispatch();
  const [hasError, setHasError] = useState(false);

  // selectors
  const counterpartiesList = useSelector(counterpartySelectors.selectAllCounterparties);
  const dropdownDataOptions = useSelector(dropdownSelectors.selectDropdownOptions);
  const externalSecuritiesList = useSelector(
    externalSecuritiesSelectors.selectExternalSecuritiesData
  );

  const raiseBulkSettlementInstructions = (payload) =>
    dispatch(paymentAndSettlementActionCreators.doRaiseBulkSettlementInstructions(payload));
  const fetchPaymentsList = () =>
    dispatch(paymentAndSettlementActionCreators.doFetchPaymentsList());

  const getCounterpartyById = (counterparty, counterpartySSI) => {
    const selectedCounterparty = counterpartiesList.filter(
      (ctpy) => ctpy.counterpartyId === counterparty
    )[0];
    const selectedSSI = selectedCounterparty?.counterpartySSI?.filter(
      (ssi) => ssi.ssiLabel === counterpartySSI
    )[0];

    if (!selectedCounterparty?.id) {
      setHasError(true);
      toast.error(`Counterparty doesn't exist`);
      return null;
    }

    if (!selectedSSI?.id) {
      setHasError(true);
      toast.error(`SSI doesn't exist`);
      return null;
    }

    return { counterPartyId: selectedCounterparty?.id, counterPartySSIId: selectedSSI?.id };
  };

  const getExternalSecurityId = (inputtedIsin) => {
    const selectedExtSecurity = externalSecuritiesList.filter(
      ({ isin }) => isin === inputtedIsin
    )[0];

    if (!selectedExtSecurity?.id) {
      setHasError(true);
      toast.error(`External Security doesn't exist`);
      return null;
    }

    return selectedExtSecurity?.id;
  };

  const getSettlementId = (settlementType) => {
    const selectedSettlementType = dropdownDataOptions?.settlementInstructionType?.filter(
      (d) => d?.name === settlementType
    )[0];
    if (!selectedSettlementType?.id) {
      toast.error(`Settlement type doesn't exist`);
      return null;
    }
    return selectedSettlementType?.id;
  };

  const handleImportCSVData = () => {
    const importedData = tableData?.filter((it) => !it.entryDate);

    const instructions = importedData.map((entry) => {
      const {
        settlementType,
        isin,
        counterparty,
        counterpartySSI,
        quantity,
        price,
        principalAmount,
        accruedInterest,
        settlementAmount,
        internalTradeRef,
      } = entry;
      const isFreeOfPayment = ["DFOP", "RFOP"].includes(settlementType);

      //   const { counterPartyId, counterPartySSIId } = getCounterpartyById(counterparty, counterpartySSI);
      const counterpartyObj = getCounterpartyById(counterparty, counterpartySSI);

      return {
        ...entry, // tradedate,settlementdate
        settlementTypeId: getSettlementId(settlementType),
        settlementType: undefined,
        externalSecuritiesId: getExternalSecurityId(isin),
        isin: undefined,
        currency: undefined,
        counterPartyId: counterpartyObj?.counterPartyId,
        counterparty: undefined,
        counterPartySSIId: counterpartyObj?.counterPartySSIId,
        counterpartySSI: undefined,
        quantity: parseInt(quantity.replace(",", ""), 10),
        price: !isFreeOfPayment ? parseFloat(price.replace(",", "")) : undefined,
        principalAmount: !isFreeOfPayment
          ? parseFloat(principalAmount.replace(",", ""))
          : undefined,
        accruedInterest: !isFreeOfPayment
          ? parseFloat(accruedInterest.replace(",", ""))
          : undefined,
        settlementAmount: !isFreeOfPayment
          ? parseFloat(settlementAmount.replace(",", ""))
          : undefined,
        internalTradeRef: internalTradeRef === "" ? "--" : internalTradeRef, // otherwise even when internalRef isn't amended appears on audit log
      };
    });

    // console.log(instructions[0], 'PAYLOAD');
    // console.log(getCounterpartyById(importedData[0]?.counterparty, importedData[0]?.counterpartySSI));

    raiseBulkSettlementInstructions({
      requestPayload: { instructions },
      successCallback: () => {
        fetchPaymentsList();
        handleClose();
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
      aria-labelledby="add-settlement-instruction-form-dialog"
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
              Do you want to raise bulk settlement instructions?
            </Typography>
          </Grid>
        </Grid>
      </DialogTitle>

      <DialogContent className="overflow-y-visible"></DialogContent>

      <DialogActions>
        <Box mb={2}>
          <Button
            onClick={() => {
              handleClose();
            }}
            color="primary"
          >
            Cancel
          </Button>

          <Button
            onClick={() => {
              handleImportCSVData();
            }}
            variant="contained"
            color="primary"
            disabled={hasError}
          >
            Submit
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default RaiseBulkTradesDialog;
