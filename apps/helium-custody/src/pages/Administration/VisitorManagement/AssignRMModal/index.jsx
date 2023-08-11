import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import makeAnimated from "react-select/animated";

import { Select } from "@emrgo-frontend/shared-ui";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import { Form, Formik } from "formik";

import { useTheme } from "../../../../context/theme-context";

const AssignRMModal = ({ open, onClose, selectedRow, assignRM, relationshipManagers }) => {
  const { t } = useTranslation(["onboarding"]);
  const { theme } = useTheme();
  const animatedComponents = makeAnimated();

  const filteredRelationshipManagers = relationshipManagers.map((managers) => ({
    data: managers,
    value: managers.id,
    label: `${managers.firstName || ""} ${managers.middleName || ""} ${managers.lastName || ""}`,
  }));

  return (
    <Fragment>
      <Formik
        initialValues={{
          selectedRM: null,
        }}
        // validationSchema={}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            setSubmitting(false);
          }, 2000);
          const payload = {
            onboardingId: selectedRow.id,
            userId: selectedRow?.user?.id,
            assignedRmId: values?.selectedRM?.value,
          };
          assignRM(payload);
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
                {t("onboarding:Forms.Assign Relationship Manager")}
              </DialogTitle>
              <DialogContent className="overflow-y-visible">
                <Grid container>
                  <Box my={1} className="w-full">
                    <FormControl className="w-full">
                      <Select
                        id="relationship-managers"
                        closeMenuOnSelect
                        placeholder={`${t("onboarding:Forms.Relationship Manager")}...`}
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
                        value={values.selectedRM}
                        options={filteredRelationshipManagers}
                        onChange={(selectedValue) => {
                          setFieldValue("selectedRM", selectedValue, false);
                        }}
                      />
                    </FormControl>
                  </Box>
                </Grid>
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

AssignRMModal.propTypes = {};

export default AssignRMModal;
