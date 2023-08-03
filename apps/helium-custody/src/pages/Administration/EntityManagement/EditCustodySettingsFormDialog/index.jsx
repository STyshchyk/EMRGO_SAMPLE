import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Select } from "@emrgo-frontend/shared-ui";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";

import { useTheme } from "../../../../context/theme-context";
import normalisedCountries from "../../../../helpers/countries";
import useWethaqAPIParams from "../../../../hooks/useWethaqAPIParams";
import * as entitiesActionCreators from "../../../../redux/actionCreators/entities";
import * as issuanceActionCreators from "../../../../redux/actionCreators/issuance";
import * as authSelectors from "../../../../redux/selectors/auth";
import * as entitiesSelectors from "../../../../redux/selectors/entities";
import * as issuanceSelectors from "../../../../redux/selectors/issuance";
import selectStyles from "../../../../styles/cssInJs/reactSelect";
import { getDropdownValues } from "../../../../utils/form";

// !WORKAROUND - this is a workaround to fix the issue with the dropdowns not showing the correct value
const recreateDropdownOption = (dropdownFieldValue, type, listOfParsedDropdownValues) => {
  if (
    !["currency", "country", "registrationRequirement", "reportingCycle", "reportingMode"].includes(
      type
    )
  ) {
    return null;
  }

  if (!dropdownFieldValue) {
    return null;
  }

  const parsedDropdownOption = listOfParsedDropdownValues.find(
    ({ value }) => value === dropdownFieldValue?.id
  );

  return parsedDropdownOption ?? null;
};

const EditCustodySettingsFormDialog = ({ selectedRow, setSelectedRow, open, handleClose }) => {
  const dispatch = useDispatch();
  // const { t } = useTranslation(['administration']);
  const isSubmitting = useSelector(entitiesSelectors.selectIsSubmitting);
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityGroupID = currentEntityGroup?.id;
  const formOptions = useSelector(issuanceSelectors.selectDropDowns);
  const { theme } = useTheme();
  const { locale } = theme;

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(() => {
    const fetchFormOptions = (payload) =>
      dispatch(issuanceActionCreators.doFetchFormOptions(payload));

    fetchFormOptions({
      options: [
        "currency",
        "country",
        "registrationRequirement",
        "reportingCycle",
        "reportingMode",
      ],
    });
  }, [dispatch]);

  const buildRequestPayload = (values) => {
    const requestPayload = values;

    const dropdownFieldNames = [
      "country",
      "baseCurrency",
      "portfolioCurrency",
      "registrationRequirement",
      "reportingCycle",
      "reportingMode",
    ];

    dropdownFieldNames.forEach((field) => {
      if (requestPayload[field]) {
        requestPayload[`${field}Id`] = requestPayload[field].value;
        delete requestPayload[field];
      }
    });

    return { ...requestPayload };
  };

  const listOfCountryDropdownOptions = getDropdownValues(
    normalisedCountries(formOptions?.country),
    locale
  );
  const listOfCurrencyDropdownOptions = getDropdownValues(formOptions?.currency, locale);
  const listOfRegistrationRequirementDropdownOptions = getDropdownValues(
    formOptions?.registrationRequirement,
    locale
  );
  const listOfReportingModeDropdownOptions = getDropdownValues(formOptions?.reportingMode, locale);
  const listOfReportingCycleDropdownOptions = getDropdownValues(
    formOptions?.reportingCycle,
    locale
  );

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      scroll="body"
      maxWidth="sm"
      aria-labelledby="form-dialog-title"
    >
      <Formik
        initialValues={{
          country: selectedRow?.securitySettings?.country
            ? recreateDropdownOption(
                selectedRow?.securitySettings?.country,
                "country",
                listOfCountryDropdownOptions
              )
            : null,
          baseCurrency: selectedRow?.securitySettings?.baseCurrency
            ? recreateDropdownOption(
                selectedRow?.securitySettings?.baseCurrency,
                "currency",
                listOfCurrencyDropdownOptions
              )
            : null,
          portfolioCurrency: selectedRow?.securitySettings?.portfolioCurrency
            ? recreateDropdownOption(
                selectedRow?.securitySettings?.portfolioCurrency,
                "currency",
                listOfCurrencyDropdownOptions
              )
            : null,
          registrationRequirement: selectedRow?.securitySettings?.registrationRequirement
            ? recreateDropdownOption(
                selectedRow?.securitySettings?.registrationRequirement,
                "registrationRequirement",
                listOfRegistrationRequirementDropdownOptions
              )
            : null,
          reportingCycle: selectedRow?.securitySettings?.reportingCycle
            ? recreateDropdownOption(
                selectedRow?.securitySettings?.reportingCycle,
                "reportingCycle",
                listOfReportingCycleDropdownOptions
              )
            : null,
          reportingMode: selectedRow?.securitySettings?.reportingMode
            ? recreateDropdownOption(
                selectedRow?.securitySettings?.reportingMode,
                "reportingMode",
                listOfReportingModeDropdownOptions
              )
            : null,
          specialRequirements: selectedRow?.securitySettings?.specialRequirements ?? "",
        }}
        enableReinitialize
        onSubmit={async (values, { setSubmitting }) => {
          const fetchEntities = () => dispatch(entitiesActionCreators.doFetchEntities());

          const requestPayload = buildRequestPayload(values);
          requestPayload.entityId = selectedRow?.id;

          const payload = {
            requestPayload,
            successCallback: () => {
              setSubmitting(false);
              setSelectedRow(null);
              handleClose();
              fetchEntities();
            },
          };

          dispatch(entitiesActionCreators.doEditEntityCustodySettings(payload));
        }}
      >
        {({ values, setFieldValue, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <DialogTitle id="edit-group-types-form-dialog-title">
              <Grid container justifyContent="space-between">
                <Grid item xs container alignContent="center">
                  <strong>Edit Entity's Custody Settings</strong>
                </Grid>
              </Grid>
            </DialogTitle>

            <DialogContent>
              <Box mb={2}>
                <Grid container spacing={2}>
                  <Grid item container xs={12} md={12} lg={12}>
                    <Grid item xs={4} container direction="column" justifyContent="center">
                      <Typography>Client Name</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>{selectedRow?.name}</Typography>
                    </Grid>
                  </Grid>

                  <Grid item container xs={12} md={12} lg={12}>
                    <Grid item xs={4} container direction="column" justifyContent="center">
                      <Typography>Residency</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <FormControl className="w-full">
                        <Select
                          closeMenuOnSelect
                          isSearchable
                          menuPortalTarget={document.body}
                          isClearable
                          styles={selectStyles}
                          value={values.country}
                          options={getDropdownValues(
                            normalisedCountries(formOptions?.country),
                            locale
                          )}
                          onChange={(selectedOption) => {
                            if (selectedOption) {
                              setFieldValue("country", selectedOption);
                            }
                          }}
                        />
                      </FormControl>
                      <ErrorMessage
                        component={Typography}
                        variant="caption"
                        color="error"
                        className="ml-4"
                        name="country"
                      />
                    </Grid>
                  </Grid>

                  <Grid item container xs={12} md={12} lg={12}>
                    <Grid item xs={4} container direction="column" justifyContent="center">
                      <Typography>Base Currency</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <FormControl className="w-full">
                        <Select
                          closeMenuOnSelect
                          isSearchable
                          menuPortalTarget={document.body}
                          styles={selectStyles}
                          value={values.baseCurrency}
                          options={listOfCurrencyDropdownOptions}
                          onChange={(selectedOption) => {
                            if (selectedOption) {
                              setFieldValue("baseCurrency", selectedOption);
                            }
                          }}
                        />
                      </FormControl>
                      <ErrorMessage
                        component={Typography}
                        variant="caption"
                        color="error"
                        className="ml-4"
                        name="baseCurrency"
                      />
                    </Grid>
                  </Grid>

                  <Grid item container xs={12} md={12} lg={12}>
                    <Grid item xs={4} container direction="column" justifyContent="center">
                      <Typography>Portfolio Currency</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <FormControl className="w-full">
                        <Select
                          closeMenuOnSelect
                          isSearchable
                          menuPortalTarget={document.body}
                          styles={selectStyles}
                          value={values.portfolioCurrency}
                          options={listOfCurrencyDropdownOptions}
                          onChange={(selectedOption) => {
                            if (selectedOption) {
                              setFieldValue("portfolioCurrency", selectedOption);
                            }
                          }}
                        />
                      </FormControl>
                      <ErrorMessage
                        component={Typography}
                        variant="caption"
                        color="error"
                        className="ml-4"
                        name="portfolioCurrency"
                      />
                    </Grid>
                  </Grid>

                  <Grid item container xs={12} md={12} lg={12}>
                    <Grid item xs={4} container direction="column" justifyContent="center">
                      <Typography>Registration Requirement</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <FormControl className="w-full">
                        <Select
                          closeMenuOnSelect
                          isSearchable
                          menuPortalTarget={document.body}
                          styles={selectStyles}
                          value={values.registrationRequirement}
                          options={listOfRegistrationRequirementDropdownOptions}
                          onChange={(selectedOption) => {
                            if (selectedOption) {
                              setFieldValue("registrationRequirement", selectedOption);
                            }
                          }}
                        />
                      </FormControl>
                      <ErrorMessage
                        component={Typography}
                        variant="caption"
                        color="error"
                        className="ml-4"
                        name="registrationRequirement"
                      />
                    </Grid>
                  </Grid>

                  <Grid item container xs={12} md={12} lg={12}>
                    <Grid item xs={4} container direction="column" justifyContent="center">
                      <Typography>Reporting Cycle</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <FormControl className="w-full">
                        <Select
                          closeMenuOnSelect
                          isSearchable
                          menuPortalTarget={document.body}
                          value={values.reportingCycle}
                          styles={selectStyles}
                          options={listOfReportingCycleDropdownOptions}
                          onChange={(selectedOption) => {
                            if (selectedOption) {
                              setFieldValue("reportingCycle", selectedOption);
                            }
                          }}
                        />
                      </FormControl>
                      <ErrorMessage
                        component={Typography}
                        variant="caption"
                        color="error"
                        className="ml-4"
                        name="reportingCycle"
                      />
                    </Grid>
                  </Grid>

                  <Grid item container xs={12} md={12} lg={12}>
                    <Grid item xs={4} container direction="column" justifyContent="center">
                      <Typography>Reporting Mode</Typography>
                    </Grid>
                    <Grid item xs={8} className="px-1">
                      <FormControl className="w-full">
                        <Select
                          closeMenuOnSelect
                          isSearchable
                          menuPortalTarget={document.body}
                          value={values.reportingMode}
                          styles={selectStyles}
                          options={listOfReportingModeDropdownOptions}
                          onChange={(selectedOption) => {
                            if (selectedOption) {
                              setFieldValue("reportingMode", selectedOption);
                            }
                          }}
                        />
                      </FormControl>
                      <ErrorMessage
                        component={Typography}
                        variant="caption"
                        color="error"
                        className="ml-4"
                        name="reportingMode"
                      />
                    </Grid>
                  </Grid>

                  <Grid item container xs={12} md={12} lg={12}>
                    <Grid item xs={4} container direction="column">
                      <Typography>Special Requirements</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <FormControl className="w-full">
                        <Field
                          component={TextField}
                          value={values.specialRequirements}
                          multiline
                          maxRows={5}
                          name="specialRequirements"
                          variant="filled"
                          type="text"
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>

            <DialogActions>
              <Grid container justifyContent="flex-end" className="w-full">
                <Grid item>
                  <Button type="button" color="primary" data-testid="cancel" onClick={handleClose}>
                    Cancel
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    data-testid="submit"
                    disabled={isSubmitting}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default EditCustodySettingsFormDialog;
