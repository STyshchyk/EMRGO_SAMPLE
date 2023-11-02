import { useTranslation } from "react-i18next";

import { Select } from "@emrgo-frontend/shared-ui";
import MaterialTable from "@material-table/core";
import CloseIcon from "@mui/icons-material/Close";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import InlineFormField from "apps/helium-custody/src/components/InlineFormField";
import MaterialTableCustomDropdownRenderer from "apps/helium-custody/src/components/MaterialTableCustomDropdownRenderer";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import PropTypes from "prop-types";

import selectStyles from "../../../../styles/cssInJs/reactSelect";
import { getDropdownValues } from "../../../../utils/form";

const AddSafekeepingAccountDialog = ({
  open,
  handleClose,
  entities,
  currencies,
  statuses,
  handleAddSafekeepingAccount,
}) => {
  const { t } = useTranslation(["safekeeping_accounts", "miscellaneous"]);

  const entityList = entities.map((entity) => {
    return {
      id: entity?.id,
      label: entity?.corporateEntityName,
      value: entity?.id,
      original: entity,
    };
  });

  const statusList = statuses.map((status) => {
    return {
      id: status,
      label: status,
      value: status,
    };
  });

  const initialValues = {
    entity: null,
    baseCurrency: null,
    name: "",
    status: statusList[0],
    currencies: [],
  };

  const currencyListForMaterialTable = {};
  const filteredCurrenciesForMaterialTable = getDropdownValues(currencies);
  filteredCurrenciesForMaterialTable.forEach((currency) => {
    currencyListForMaterialTable[currency.value] = currency.label;
  });
  const columns = [
    {
      title: "Currency",
      field: "currency",
      lookup: currencyListForMaterialTable,
      editComponent: (props) => <MaterialTableCustomDropdownRenderer {...props} />,
    },
    {
      title: "Account Identifier",
      field: "account",
      editable: "never",
    },
  ];

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleAddSafekeepingAccount}
      // validationSchema={addPaymentAccountFormSchema}
      enableReinitialize
    >
      {({ values, setFieldValue, errors, handleSubmit }) => {
        const tableValues = values.currencies.map((currencyAccount) => {
          return {
            currency: currencyAccount.currency.value,
            account: currencyAccount.currency.account || "-",
          };
        });
        return (
          <Form noValidate>
            <Dialog
              open={open}
              onClose={(event, reason) => {
                if (reason && reason === "backdropClick") return;

                handleClose();
              }}
              aria-labelledby="form-dialog-title"
              fullWidth
              maxWidth="md"
            >
              <DialogTitle id="add-payment-account-form-dialog-title">
                <Grid container justifyContent="space-between">
                  <Grid item xs container alignContent="center">
                    <Typography variant="h6">{t("Modal.Add Safekeeping Account")}</Typography>
                  </Grid>

                  <IconButton aria-label="close" onClick={handleClose} size="large">
                    <CloseIcon />
                  </IconButton>
                </Grid>
              </DialogTitle>
              <DialogContent>
                <Box pb={2}>
                  <Grid container spacing={2}>
                    <Grid item container spacing={2}>
                      <InlineFormField label={"Entity"} name="sourceEntity">
                        <Select
                          closeMenuOnSelect
                          placeholder={`Select ${t("Modal.Entity")}...`}
                          isSearchable
                          styles={selectStyles}
                          menuPortalTarget={document.body}
                          value={values.entity}
                          isClearable
                          options={entityList}
                          onChange={(newValue, triggeredAction) => {
                            setFieldValue("entity", newValue);
                            if (triggeredAction.action === "clear") {
                              setFieldValue("entity", null);
                            }
                          }}
                        />
                      </InlineFormField>

                      <InlineFormField label={t("Modal.Portfolio Identifier")}>
                        <Field
                          fullWidth
                          component={TextField}
                          name="name"
                          variant="outlined"
                          size="small"
                          type="text"
                        />
                      </InlineFormField>

                      <InlineFormField label={t("Modal.Safekeeping Account")}>
                        <Field
                          fullWidth
                          component={TextField}
                          name="label"
                          placeholder="Autogenerated Account Identifier"
                          variant="outlined"
                          size="small"
                          type="text"
                          disabled
                        />
                      </InlineFormField>

                      <InlineFormField label={t("Modal.Base Currency")} name="currency">
                        <Select
                          closeMenuOnSelect
                          placeholder={`Select ${t("Modal.Base Currency")}...`}
                          isSearchable
                          styles={selectStyles}
                          menuPortalTarget={document.body}
                          value={values.currency}
                          isClearable
                          options={getDropdownValues(currencies)}
                          onChange={(newValue, triggeredAction) => {
                            setFieldValue("baseCurrency", newValue);
                            if (triggeredAction.action === "clear") {
                              setFieldValue("baseCurrency", null);
                            }
                          }}
                        />
                      </InlineFormField>
                      <InlineFormField label={t("Modal.Status")} name="status">
                        <Select
                          closeMenuOnSelect
                          placeholder={`Select ${t("Modal.Status")}...`}
                          isSearchable
                          styles={selectStyles}
                          menuPortalTarget={document.body}
                          value={values.status}
                          isClearable
                          options={statusList}
                          onChange={(newValue, triggeredAction) => {
                            setFieldValue("status", newValue);
                            if (triggeredAction.action === "clear") {
                              setFieldValue("status", null);
                            }
                          }}
                        />
                      </InlineFormField>
                    </Grid>
                    <Grid item xs>
                      <MaterialTable
                        title="Associated Accounts"
                        columns={columns}
                        data={tableValues}
                        components={{
                          Container: (props) => <Paper {...props} elevation={0} />,
                        }}
                        options={{
                          search: false,
                          actionsColumnIndex: -1,
                        }}
                        fullWidth
                        editable={{
                          onRowAdd: (newData) =>
                            new Promise((resolve, reject) => {
                              setTimeout(() => {
                                setFieldValue("currencies", [...values.currencies, newData]);

                                resolve();
                              }, 1000);
                            }),
                          onRowDelete: (oldData) =>
                            new Promise((resolve, reject) => {
                              const index = oldData.currency;
                              setTimeout(() => {
                                const dataDelete = [...values.currencies].filter(
                                  (currency) => currency.currency.value !== index
                                );
                                setFieldValue("currencies", [...dataDelete]);
                                resolve();
                              }, 1000);
                            }),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </DialogContent>
              <DialogActions>
                <Grid item container justifyContent="flex-end" spacing={2}>
                  <Grid item>
                    <Button
                      color="primary"
                      variant="outlined"
                      onClick={() => {
                        handleClose();
                      }}
                    >
                      {t("miscellaneous:Buttons.Cancel")}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      type="submit"
                      variant="contained"
                      data-testid="submit"
                      disabled={
                        !values?.entity || !values?.name || !values?.baseCurrency || !values?.status
                      }
                      onClick={() => handleSubmit()}
                    >
                      {t("miscellaneous:Buttons.Submit")}
                    </Button>
                  </Grid>
                </Grid>
              </DialogActions>
            </Dialog>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddSafekeepingAccountDialog;

AddSafekeepingAccountDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
