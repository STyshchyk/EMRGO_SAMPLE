import { Fragment } from "react";
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

  const isApprove = action === "approve";

  return (
    <Fragment>
      <Formik
        initialValues={{}}
        // validationSchema={}
        onSubmit={(values, { setSubmitting }) => {
          const payload = {
            transactionId: selectedRow.id,
            requestPayload: {
              action,
            },
            dateRange: currentlySelectedDateRange,
            successCallback: () => {
              setSubmitting(false);
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
                  ? t("fx_transactions:Fx Action Modal.Approve Transaction")
                  : t("fx_transactions:Fx Action Modal.Cancel Transaction")}
                ?
              </DialogTitle>
              <DialogContent>
                {isApprove
                  ? t(
                      "fx_transactions:Fx Action Modal.Are you sure you want to approve this transaction? This action is non reversible"
                    )
                  : t(
                      "fx_transactions:Fx Action Modal.Are you sure you want to cancel this transaction? This action is non reversible"
                    )}
              </DialogContent>
              <DialogActions>
                <Grid container justifyContent="flex-end" className="mx-4 mb-4">
                  <Grid item xs={12} lg={4}>
                    <Button type="submit" color="primary" fullWidth onClick={onClose}>
                      {t("fx_transactions:Fx Action Modal.Buttons.Cancel")}
                    </Button>
                  </Grid>
                  <Grid item xs={12} lg={5}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handleSubmit}
                    >
                      {isApprove
                        ? t("fx_transactions:Fx Action Modal.Approve Transaction")
                        : t("fx_transactions:Fx Action Modal.Cancel Transaction")}
                    </Button>
                  </Grid>
                </Grid>
              </DialogActions>
            </Dialog>
          </Form>
        )}
      </Formik>
    </Fragment>
  );
};

FXTransactionActionModal.propTypes = {};

export default FXTransactionActionModal;
