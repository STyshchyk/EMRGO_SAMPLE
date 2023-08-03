import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Select } from "@emrgo-frontend/shared-ui";
import makeAnimated from "react-select/animated";

import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import { Form, Formik } from "formik";

import entityTypes from "../../../../constants/wethaqAPI/onboarding";
import { useTheme } from "../../../../context/theme-context";

const RequestKYCModal = ({ open, onClose, selectedRow, requestKYC }) => {
  const { t } = useTranslation(["onboarding"]);
  const { theme } = useTheme();
  const animatedComponents = makeAnimated();

  return (
    <Fragment>
      <Formik
        initialValues={{
          entityType: null,
          role: null,
        }}
        enableReinitialize
        // validationSchema={}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            setSubmitting(false);
          }, 2000);
          const payload = {
            onboardingId: selectedRow.id,
            userId: selectedRow?.user?.id,
            entityType: values.entityType.value,
            role: values.role.value,
          };
          requestKYC(payload);
        }}
      >
        {({ values, handleSubmit, setFieldValue }) => (
          <Form>
            <Dialog
              fullWidth
              open={open}
              onClose={onClose}
              aria-labelledby="form-dialog-title"
              PaperProps={{ className: "overflow-y-visible" }}
            >
              <DialogTitle id="edit-group-types-form-dialog-title">
                {t("onboarding:Forms.Request User & Entity KYC")}
              </DialogTitle>
              <DialogContent className="overflow-y-visible">
                <MuiPickersUtilsProvider utils={MomentUtils} locale={theme.locale.altLocale}>
                  <Grid container>
                    <Box my={1} className="w-full">
                      <FormControl className="w-full">
                        <Select
                          id="entity-type"
                          closeMenuOnSelect
                          placeholder={`${t("onboarding:Forms.Entity Type")}...`}
                          isSearchable
                          components={{
                            ...animatedComponents,
                          }}
                          styles={{
                            menu: (styles) => ({
                              ...styles,
                              zIndex: 10,
                            }),
                            control: (styles) => ({
                              ...styles,
                              border: "none",
                              borderRadius: "6px",
                              backgroundColor: "rgba(0, 0, 0, 0.09)",
                              height: "3rem",
                            }),
                          }}
                          value={values.entityType}
                          options={entityTypes}
                          onChange={(selectedValue) => {
                            setFieldValue("role", null, false);
                            setFieldValue("entityType", selectedValue, false);
                          }}
                        />
                      </FormControl>
                    </Box>
                  </Grid>
                  <Grid container>
                    <Box my={1} className="w-full">
                      <FormControl className="w-full">
                        <Select
                          id="role"
                          closeMenuOnSelect
                          placeholder={`${t("onboarding:Forms.Role")}...`}
                          isSearchable
                          components={{
                            ...animatedComponents,
                          }}
                          styles={{
                            menu: (styles) => ({
                              ...styles,
                              zIndex: 10,
                            }),
                            control: (styles) => ({
                              ...styles,
                              border: "none",
                              borderRadius: "6px",
                              backgroundColor: "rgba(0, 0, 0, 0.09)",
                              height: "3rem",
                            }),
                          }}
                          value={values.role}
                          options={values?.entityType?.roles || []}
                          onChange={(selectedValue) => {
                            setFieldValue("role", selectedValue, false);
                          }}
                        />
                      </FormControl>
                    </Box>
                  </Grid>
                </MuiPickersUtilsProvider>
              </DialogContent>
              <DialogActions>
                <Grid container justifyContent="flex-end" className="mx-4 mb-4">
                  <Grid item xs={12} lg={4}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handleSubmit}
                    >
                      {t("onboarding:Forms.Request")}
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

RequestKYCModal.propTypes = {};

export default RequestKYCModal;
