import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import { Form, Formik } from "formik";

import * as fxTransactionsActionCreators from "../../redux/actionCreators/fxTransactions";

const FXTransactionActionModal = ({
  open,
  action,
  onClose,
  selectedRow,
  currentlySelectedDateRange,
}) => {
  const { t } = useTranslation(["fx_transactions"]);
  const dispatch = useDispatch();

  // Use local state for isSubmitting
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isApprove = action === "approve";

  return (
    <Formik
      initialValues={{}}
      // validationSchema={}
      onSubmit={(values, { setSubmitting }) => {
        setIsSubmitting(true); // Set isSubmitting to true when submitting
        const payload = {
          transactionId: selectedRow.id,
          requestPayload: {
            action,
          },
          dateRange: currentlySelectedDateRange,
          successCallback: () => {
            setIsSubmitting(false);
            setSubmitting(false);
            onClose();
          },
          errorCallback: () => {
            setIsSubmitting(false);
            onClose();
          },
        };

        dispatch(fxTransactionsActionCreators.doProcessFxTransactions(payload));
      }}
    >
      {({ handleSubmit }) => (
        <Form>
          <Dialog
            fullWidth
            open={open}
            onClose={onClose}
            aria-labelledby="form-dialog-title"
            PaperProps={{ className: "overflow-y-visible" }}
          >
            <DialogTitle>
              {isApprove
                ? t("Fx Action Modal.Approve Transaction")
                : t("Fx Action Modal.Cancel Transaction")}
              ?
            </DialogTitle>
            <DialogContent>
              {isApprove
                ? t(
                    "Fx Action Modal.Are you sure you want to approve this transaction? This action is non reversible"
                  )
                : t(
                    "Fx Action Modal.Are you sure you want to cancel this transaction? This action is non reversible"
                  )}
            </DialogContent>
            <DialogActions>
              <Grid container justifyContent="flex-end" className="mx-4 mb-4">
                <Grid item xs={12} lg={4}>
                  <Button type="submit" color="primary" fullWidth onClick={onClose}>
                    {t("Fx Action Modal.Buttons.Cancel")}
                  </Button>
                </Grid>
                <Grid item xs={12} lg={5}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isApprove
                      ? t("Fx Action Modal.Approve Transaction")
                      : t("Fx Action Modal.Cancel Transaction")}
                  </Button>
                </Grid>
              </Grid>
            </DialogActions>
          </Dialog>
        </Form>
      )}
    </Formik>
  );
};

FXTransactionActionModal.propTypes = {};

export default FXTransactionActionModal;
