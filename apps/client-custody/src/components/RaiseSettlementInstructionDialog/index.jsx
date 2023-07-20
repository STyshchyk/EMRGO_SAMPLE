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
import * as paymentAndSettlementActionCreators from "redux/actionCreators/paymentAndSettlement";
import * as entitiesSelectors from "redux/selectors/entities";
import * as paymentAndSettlementSelectors from "redux/selectors/paymentAndSettlement";

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

const RaiseSettlementInstructionDialog = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const entities = useSelector(entitiesSelectors.selectEntities);

  // selectors
  const isSubmitting = useSelector(paymentAndSettlementSelectors.selectIsSubmitting);

  const handleSubmit = (values) => {
    const raiseSettlementInstruction = (payload) =>
      dispatch(paymentAndSettlementActionCreators.doRaiseSettlementInstruction(payload));
    const fetchPaymentsList = () =>
      dispatch(paymentAndSettlementActionCreators.doFetchPaymentsList());

    const requestPayload = buildRaiseSIRequestPayload(values);

    raiseSettlementInstruction({
      requestPayload,
      successCallback: () => {
        fetchPaymentsList();
        handleClose();
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
              Add Settlement Instruction Form
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
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            handleCloseDialog={() => handleClose()}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

RaiseSettlementInstructionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default RaiseSettlementInstructionDialog;
