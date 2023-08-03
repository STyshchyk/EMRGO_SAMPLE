import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Select } from "@emrgo-frontend/shared-ui";
import makeAnimated from "react-select/animated";

import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";

import { useTheme } from "../../../../context/theme-context";
import regionSwitcher from "../../../../helpers/regions";

const AssignApproveModal = ({
  open,
  onClose,
  selectedRow,
  approveEntity,
  currentEntityGroupID,
}) => {
  const { t } = useTranslation(["onboarding"]);
  const { theme } = useTheme();
  const animatedComponents = makeAnimated();

  const CLASSIFICATION_OPTIONS = [
    { label: t("onboarding:Market Counter-Party"), value: "Market Counter Party" },
    { label: t("onboarding:Deemed Professional Client"), value: "Deemed Professional Client" },
    { label: t("onboarding:Assessed Professional Client"), value: "Assessed Professional Client" },
  ];

  const CLASSIFICATION_OPTIONS_SA = [
    { label: t("onboarding:Capital Market Institution"), value: "Capital Market Institution" },
    { label: t("onboarding:Qualified Client"), value: "Qualified Client" },
    { label: t("onboarding:Institutional Client"), value: "Institutional Client" },
  ];

  const classificationOptions = regionSwitcher({
    sa: CLASSIFICATION_OPTIONS_SA,
    ae: CLASSIFICATION_OPTIONS,
  });

  const selectedClassification = classificationOptions.find(
    (option) => option.value === selectedRow?.selfAssessment
  );

  return (
    <Fragment>
      <Formik
        initialValues={{
          firstName: selectedRow?.user?.firstName,
          middleName: selectedRow?.user?.middleName,
          lastName: selectedRow?.user?.lastName,
          entityType: selectedRow?.entityUserType,
          role: selectedRow?.role,
          classification: selectedClassification || null,
          legalName: selectedRow?.legalName || null,
          entityName: selectedRow?.entityName,
        }}
        enableReinitialize
        // validationSchema={}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            setSubmitting(false);
          }, 2000);

          const payload = {
            params: { currentGroupId: currentEntityGroupID },
            data: { id: selectedRow.entity.id, type: "entity", action: "accept" },
          };

          approveEntity(payload);
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
                {t("onboarding:Forms.Assign & Approve")}
              </DialogTitle>
              <DialogContent className="overflow-y-visible">
                <MuiPickersUtilsProvider utils={MomentUtils} locale={theme.locale.altLocale}>
                  <Grid container className="my-4">
                    <Field
                      disabled
                      fullWidth
                      component={TextField}
                      label={t("onboarding:Forms.First Name")}
                      name="firstName"
                      variant="filled"
                    />
                  </Grid>
                  <Grid container className="my-4">
                    <Field
                      disabled
                      fullWidth
                      component={TextField}
                      label={t("onboarding:Forms.Middle Name")}
                      name="middleName"
                      variant="filled"
                    />
                  </Grid>
                  <Grid container className="my-4">
                    <Field
                      disabled
                      fullWidth
                      component={TextField}
                      label={t("onboarding:Forms.Last Name")}
                      name="lastName"
                      variant="filled"
                    />
                  </Grid>
                  <Grid container className="my-4">
                    <Field
                      disabled
                      fullWidth
                      component={TextField}
                      label={t("onboarding:Forms.Entity Type")}
                      name="entityType"
                      variant="filled"
                    />
                  </Grid>
                  <Grid container className="my-4">
                    <Field
                      disabled
                      fullWidth
                      component={TextField}
                      label={t("onboarding:Forms.Role")}
                      name="role"
                      variant="filled"
                    />
                  </Grid>
                  <Grid container>
                    <Box my={1} className="w-full">
                      <FormControl className="w-full">
                        <Select
                          closeMenuOnSelect
                          placeholder={`${t("onboarding:Forms.Classification")}...`}
                          isSearchable
                          components={{
                            ...animatedComponents,
                            // eslint-disable-next-line react/prop-types
                            MultiValueContainer: ({ data }) => (
                              <Chip
                                // eslint-disable-next-line react/prop-types
                                key={data.value}
                                // eslint-disable-next-line react/prop-types
                                label={data.value}
                                className="my-2"
                                // eslint-disable-next-line react/prop-types
                                // onDelete={(e) => handleRemoveCountrySelection(e, data.value)}
                                color="secondary"
                              />
                            ),
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
                          value={values.classification}
                          options={classificationOptions}
                          onChange={(selectedValue) => {
                            setFieldValue("classification", selectedValue, false);
                          }}
                        />
                      </FormControl>
                    </Box>
                  </Grid>
                  <Grid container className="my-4">
                    <Field
                      fullWidth
                      component={TextField}
                      label={t("onboarding:Forms.Entity Name (Legal)")}
                      name="legalName"
                      variant="filled"
                    />
                  </Grid>
                  <Grid container className="my-4">
                    <Field
                      disabled
                      fullWidth
                      component={TextField}
                      label={t("onboarding:Forms.Entity Name (Platform)")}
                      name="entityName"
                      variant="filled"
                    />
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
                      {t("onboarding:Forms.Assign")}
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

AssignApproveModal.propTypes = {};

export default AssignApproveModal;
