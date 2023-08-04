import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import cx from "classnames";
import { Field, Formik } from "formik";
import { TextField } from "formik-mui";
import PropTypes from "prop-types";

import Checkbox from "../../../../components/Checkbox";
// import { addAccountSchema } from '../../validationSchemas';
import style from "./style.module.scss";

const EditEntityAccountModal = ({ isModalOpen, setIsModalOpen, onSubmit, accountDetails }) => {
  const { t } = useTranslation(["administration"]);

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <Formik
      initialValues={{
        iban: accountDetails.iban,
        externalAccountNumber: accountDetails.externalAccountNumber,
        isVirtualIBAN: accountDetails.isVirtualIban === "Yes",
      }}
      enableReinitialize
      onSubmit={(values, { resetForm }) => {
        const payload = { ...values, isVirtualIBAN: values.isVirtualIBAN === true };

        onSubmit(payload, () => {
          resetForm();
          setIsModalOpen(false);
        });
      }}
    >
      {({ handleSubmit, resetForm }) => (
        <form onSubmit={handleSubmit} className={cx(style.formWrapper)} noValidate>
          <Dialog
            open={isModalOpen}
            onClose={(event, reason) => {
              if (reason && reason === "backdropClick") return;

              handleClose();
            }}
            aria-labelledby="send-onboarding-invitation"
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle id="form-dialog-title">
              {t("EntityAccountManagement.Add Account")}
            </DialogTitle>
            <DialogContent>
              <Box mb={2}>
                <Box my={1} className="w-full">
                  <Field
                    component={TextField}
                    label={t("EntityAccountManagement.IBAN Number")}
                    name="iban"
                    variant="filled"
                    fullWidth
                  />
                </Box>
                <Box my={1} className="w-full">
                  <Field
                    component={TextField}
                    label={t("EntityAccountManagement.External Account")}
                    name="externalAccountNumber"
                    variant="filled"
                    fullWidth
                  />
                </Box>
                <Box my={1} className="w-full">
                  <FormControl className={style.input__form_control}>
                    <Checkbox
                      name="isVirtualIBAN"
                      label={t("EntityAccountManagement.Virtual IBAN")}
                    />
                  </FormControl>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  handleClose();
                  resetForm();
                }}
                color="primary"
              >
                {t("EntityAccountManagement.Cancel")}
              </Button>
              <Button onClick={handleSubmit} variant="contained" color="primary">
                {t("EntityAccountManagement.Submit")}
              </Button>
            </DialogActions>
          </Dialog>
        </form>
      )}
    </Formik>
  );
};

EditEntityAccountModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default EditEntityAccountModal;
