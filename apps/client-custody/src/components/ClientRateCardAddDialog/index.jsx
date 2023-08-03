import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Select } from "@emrgo-frontend/shared-ui";
import makeAnimated from "react-select/animated";

import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { ErrorMessage, Field, Formik } from "formik";
import { TextField } from "formik-mui";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import * as yup from "yup";

import { useTheme } from "../../context/theme-context";
import { generateAccountOptions } from "../../helpers/billing";
import useWethaqAPIParams from "../../hooks/useWethaqAPIParams";
import * as billingActionCreators from "../../redux/actionCreators/billing";
import * as cashManagementActionCreators from "../../redux/actionCreators/cashManagement";
import * as entitiesActionCreators from "../../redux/actionCreators/entities";
import * as authSelectors from "../../redux/selectors/auth";
import * as cashManagementSelectors from "../../redux/selectors/cashManagement";
import * as dropdownSelectors from "../../redux/selectors/dropdown";
import * as entitiesSelectors from "../../redux/selectors/entities";
import selectStyles from "../../styles/cssInJs/reactSelect";
import { getDropdownValues } from "../../utils/form";

// import { Divider } from '@mui/material';

const animatedComponents = makeAnimated();

const ClientRateCardAddDialog = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["billing"]);
  const { theme } = useTheme();
  const { locale } = theme;
  const [addMore, setAddMore] = useState(false);

  // selectors
  const currentUserId = useSelector(authSelectors.selectUserId);
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityGroupEntityType = currentEntityGroup?.entityType;
  const isWethaqUser = currentEntityGroupEntityType === "EMRGO_SERVICES";
  const entitiesList = useSelector(entitiesSelectors.selectEntities);
  const dropdownOptions = useSelector(dropdownSelectors.selectDropdownOptions);
  const sourceAccounts = generateAccountOptions(
    useSelector(cashManagementSelectors.selectAccountsData)?.data || []
  );
  const USDCurrency = dropdownOptions?.currency?.find((currency) => currency.name === "USD");

  const billingPeriodOptions = getDropdownValues(
    dropdownOptions?.reportingCycle?.filter((period) => period.key === "monthly"),
    locale
  );
  const filteredInvestors = entitiesList?.filter((entity) => {
    const entityGroups = entity?.groups;
    const foundInvestor = entityGroups.find((entityGroup) => entityGroup.entityType === "INVESTOR");
    return foundInvestor;
  });
  const entitiesDropdown = isWethaqUser
    ? filteredInvestors.map((entity) => ({
        value: entity.id,
        label: entity.corporateEntityName,
        groups: entity.groups,
      }))
    : null;

  useWethaqAPIParams({
    currentGroupId: currentEntityGroup?.id,
  });

  useEffect(() => {
    // fetch these entities for wethaq ops
    const fetchEntities = (payload) => dispatch(entitiesActionCreators.doFetchEntities(payload));
    const fetchAccounts = (payload) =>
      dispatch(cashManagementActionCreators.doFetchAccounts(payload));

    fetchEntities();
    fetchAccounts();
  }, [dispatch]);

  const handleRateCardSubmit = (data, actions) => {
    const requestPayload = {
      entity_id: data.entityId,
      start_date: data.startDate.format(),
      end_date: {
        Time: data.endDate ? data.endDate.format() : null,
        Valid: true,
      },
      min_charge: data.minimumCharge,
      created_by: currentUserId,
      billing_period_id: data.billingPeriodId,
      // status_id: AmendedClientRateCardStatus.id,
    };

    dispatch(billingActionCreators.doCreateRatecardRequest(requestPayload));

    if (!addMore) {
      handleClose();
    } else {
      actions.resetForm();
    }
  };

  const handleAddMoreChange = (event) => {
    setAddMore(event.target.checked);
  };

  return (
    <Fragment>
      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        scroll="body"
        maxWidth="md"
      >
        <MuiPickersUtilsProvider utils={MomentUtils} locale={theme.locale.altLocale}>
          <Formik
            initialValues={{
              investor: null,
              entityId: "",
              entityGroupId: "",
              billingAccountId: "",
              billingAccount: null,
              billingPeriod: billingPeriodOptions[0],
              billingPeriodId: billingPeriodOptions[0]?.value,
              minimumCharge: 0,
              startDate: moment(),
              endDate: null,
            }}
            validationSchema={yup.object().shape({
              entityId: yup.string().required("Client is required"),
              billingAccount: yup.string().nullable().required("Client Account is required"),
              billingPeriodId: yup.string().nullable().required("Billing Period is required"),
            })}
            enableReinitialize
            onSubmit={(values, actions) => {
              handleRateCardSubmit(values, actions);

              setTimeout(() => {
                actions.setSubmitting(false);
              }, 3000);
            }}
          >
            {({ values, handleSubmit, setFieldValue }) => {
              const filteredAccounts = sourceAccounts
                ?.filter((account) => account.value.entityGroupId === values.entityGroupId)
                .filter((account) => account.value.currencyId === USDCurrency.id);
              return (
                <form onSubmit={handleSubmit}>
                  <DialogTitle id="form-dialog-title">
                    {" "}
                    {t("Client Rate Card.Add Dialog.Add Client Rate Card")}
                  </DialogTitle>

                  <DialogContent>
                    <Box mb={2}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={12} lg={6} container>
                          <Grid item xs={6} alignContent="flex-start">
                            <Typography className="mt-4">
                              {t("Client Rate Card.Add Dialog.Client")}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} alignContent="center" className="px-1">
                            <FormControl className="w-full">
                              <Select
                                closeMenuOnSelect
                                placeholder={t("components:Select.Select")}
                                isSearchable
                                styles={selectStyles}
                                menuPortalTarget={document.body}
                                value={values.investor}
                                options={entitiesDropdown}
                                onChange={(selectedEntity) => {
                                  setFieldValue("investor", selectedEntity);
                                  const investorGroup = selectedEntity.groups.find(
                                    (group) => group.entityType === "INVESTOR"
                                  );
                                  setFieldValue("entityId", selectedEntity.value);
                                  setFieldValue("entityGroupId", investorGroup.id);
                                }}
                              />
                            </FormControl>
                            <ErrorMessage
                              component={Typography}
                              variant="caption"
                              color="error"
                              className="ml-2"
                              name="entityId"
                            />
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={12} lg={6} container>
                          <Grid item xs={6} alignContent="flex-start">
                            <Typography className="mt-4">
                              {t("Client Rate Card.Add Dialog.Billing Account")}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} alignContent="center" className="px-1">
                            <FormControl className="w-full">
                              <Select
                                closeMenuOnSelect
                                placeholder="Select.."
                                components={{
                                  ...animatedComponents,
                                }}
                                isSearchable
                                styles={selectStyles}
                                value={values.billingAccount}
                                isClearable
                                options={filteredAccounts}
                                onChange={(selected) => {
                                  setFieldValue("billingAccount", selected);
                                  setFieldValue("billingAccountId", selected.value.id);
                                }}
                              />
                            </FormControl>
                            <ErrorMessage
                              component={Typography}
                              variant="caption"
                              color="error"
                              className="ml-2"
                              name="billingAccount"
                            />
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={12} lg={6} container>
                          <Grid item xs={6} alignContent="flex-start">
                            <Typography className="mt-4">
                              {t("Client Rate Card.Add Dialog.Billing Period")}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} alignContent="center" className="px-1">
                            <FormControl className="w-full">
                              <Select
                                closeMenuOnSelect
                                placeholder="Select.."
                                components={{
                                  ...animatedComponents,
                                }}
                                menuPortalTarget={document.body}
                                isSearchable
                                styles={selectStyles}
                                value={values.billingPeriod}
                                options={billingPeriodOptions}
                                onChange={(selected) => {
                                  setFieldValue("billingPeriod", selected);
                                  setFieldValue("billingPeriodId", selected.value);
                                }}
                              />
                            </FormControl>
                            <ErrorMessage
                              component={Typography}
                              variant="caption"
                              color="error"
                              className="ml-2"
                              name="billingPeriod"
                            />
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={12} lg={6} container>
                          <Grid item xs={6} alignContent="flex-start">
                            <Typography className="mt-4">
                              {t("Client Rate Card.Add Dialog.Minimum Charge (USD)")}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} alignContent="center" className="px-1">
                            <Field
                              fullWidth
                              component={TextField}
                              name="minimumCharge"
                              variant="filled"
                            />
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={12} lg={6} container>
                          <Grid item xs={12} md={6} lg={6}>
                            <Typography className="mt-4">
                              {t("Client Rate Card.Add Dialog.Start Date")}{" "}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6} lg={6} className="px-1">
                            <Field
                              fullWidth
                              format="DD/MM/YYYY"
                              inputVariant="filled"
                              variant="dialog"
                              minDate={moment()}
                              placeholder="DD/MM/YYYY"
                              component={DatePicker}
                              name="startDate"
                              label={t("Client Rate Card.Add Dialog.Start Date")}
                            />
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={12} lg={6} container>
                          <Grid item xs={12} md={6} lg={6}>
                            <Typography className="mt-4">
                              {t("Client Rate Card.Add Dialog.End Date")}{" "}
                            </Typography>
                          </Grid>
                          <Grid xs={12} md={6} lg={6} className="px-1">
                            <Field
                              fullWidth
                              format="DD/MM/YYYY"
                              inputVariant="filled"
                              variant="dialog"
                              minDate={values.startDate}
                              placeholder="DD/MM/YYYY"
                              component={DatePicker}
                              name="endDate"
                              label={t("Client Rate Card.Add Dialog.End Date")}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Box>
                  </DialogContent>

                  <DialogActions>
                    <Grid container justifyContent="flex-end" className="w-full">
                      <Grid item lg={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={addMore}
                              onChange={handleAddMoreChange}
                              name="checkedA"
                            />
                          }
                          label={t("Client Rate Card.Add Dialog.Add more Rate Cards?")}
                        />
                      </Grid>
                      <Grid item lg={3}>
                        <Button
                          fullWidth
                          onClick={() => {
                            handleClose();
                          }}
                          color="primary"
                        >
                          {t("translation:Miscellaneous.Cancel")}
                        </Button>
                      </Grid>
                      <Grid item lg={3}>
                        <Button fullWidth type="submit" variant="contained" color="primary">
                          {t("translation:Miscellaneous.Submit")}
                        </Button>
                      </Grid>
                    </Grid>
                  </DialogActions>
                </form>
              );
            }}
          </Formik>
        </MuiPickersUtilsProvider>
      </Dialog>
    </Fragment>
  );
};

export default ClientRateCardAddDialog;
