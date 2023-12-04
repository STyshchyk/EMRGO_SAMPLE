import { createRef, Fragment, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Select } from "@emrgo-frontend/shared-ui";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import moment from "moment";
import v from "voca";

import PageTitle from "../../../components/PageTitle";
import ReactSelectCurrencyOption from "../../../components/ReactSelectCurrencyOption";
import useWethaqAPIParams from "../../../hooks/useWethaqAPIParams";
import * as billingAndPaymentsActionCreators from "../../../redux/actionCreators/cashManagement";
import * as authSelectors from "../../../redux/selectors/auth";
import * as billingAndPaymentsSelectors from "../../../redux/selectors/cashManagement";
import selectStyles from "../../../styles/cssInJs/reactSelect";
import style from "./style.module.scss";

const AccountTransferPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["cash_management", "components"]);

  const sourceEntityRef = createRef();
  const sourceAccountRef = createRef();
  const destinationEntityRef = createRef();
  const destinationAccountRef = createRef();

  const formattedDate = moment().format("DD/MM/YYYY");

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityGroupID = currentEntityGroup?.id;

  const sourceOwners = useSelector(billingAndPaymentsSelectors.selectSourceOwners);
  const destinationOwners = useSelector(billingAndPaymentsSelectors.selectDestinationOwners);

  const sourceAccounts = useSelector(billingAndPaymentsSelectors.selectSourceAccounts);
  const destinationAccounts = useSelector(billingAndPaymentsSelectors.selectDestinationAccounts);

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  const fetchSourceOwners = useCallback(
    (payload) => dispatch(billingAndPaymentsActionCreators.doFetchSourceOwners(payload)),
    [dispatch]
  );
  const fetchEmrgoOwners = useCallback(
    (payload) => dispatch(billingAndPaymentsActionCreators.doFetchEmrgoOwners(payload)),
    [dispatch]
  );
  const fetchDestinationOwners = useCallback(
    (payload) => dispatch(billingAndPaymentsActionCreators.doFetchDestinationOwners(payload)),
    [dispatch]
  );
  const fetchSourceAccounts = useCallback(
    (payload) => dispatch(billingAndPaymentsActionCreators.doFetchSourceAccounts(payload)),
    [dispatch]
  );
  const fetchDestinationAccounts = useCallback(
    (payload) => dispatch(billingAndPaymentsActionCreators.doFetchDestinationAccounts(payload)),
    [dispatch]
  );

  useEffect(() => {
    fetchSourceOwners();
    fetchEmrgoOwners();
    fetchDestinationOwners();
    fetchSourceAccounts();
    fetchDestinationAccounts();
  }, [
    fetchSourceOwners,
    fetchDestinationOwners,
    fetchSourceAccounts,
    fetchDestinationAccounts,
    fetchEmrgoOwners,
  ]);

  const sourceEntitiesDropdown = sourceOwners.map((entity) => ({
    value: entity.id,
    label: entity.corporateEntityName,
  }));

  let sourceAccountsDropdown = sourceAccounts.map((account) => ({
    value: {
      accountId: account.id,
      entityId: account.group.entity.id,
      currencyId: account.currency.id,
      currency: account.currency.name,
    },
    label: `${account.accountNo} ${v.capitalize(account.type)}`,
    customLabel: `${account.accountNo} ${v.capitalize(account.type)}`,
  }));

  const destinationEntitiesDropdown = destinationOwners.map((entity) => ({
    value: entity.id,
    label: entity.corporateEntityName,
  }));

  let destinationAccountsDropdown = destinationAccounts.map((account) => ({
    value: {
      accountId: account.id,
      entityId: account.group.entity.id,
      currencyId: account.currency.id,
      currency: account.currency.name,
    },
    label: `${account.accountNo} ${v.capitalize(account.type)}`,
    customLabel: account.accountNo,
  }));

  return (
    <Fragment>
      <PageTitle title={t("Internal Transfer.Internal Transfer")} />
      <Formik
        initialValues={{
          date: formattedDate,
          sourceEntity: null,
          sourceAccount: null,
          destinationEntity: null,
          destinationAccount: null,
          transferAmount: 0,
          description: "",
        }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            setSubmitting(false);
          }, 1000);

          const requestPayload = {
            amount: values.transferAmount,
            description: values.description,
            sourceAccountId: values.sourceAccount.value.accountId,
            destinationAccountId: values.destinationAccount.value.accountId,
          };

          dispatch(
            billingAndPaymentsActionCreators.doMoneyTransferInternal({
              requestPayload,
            })
          );
        }}
      >
        {({ values, setFieldValue, isSubmitting }) => {
          const sourceEntityChange = (selectedEntity) => {
            setFieldValue("sourceEntity", selectedEntity);
            setFieldValue("sourceAccount", null);
            sourceAccountsDropdown = sourceAccounts
              .filter((account) =>
                selectedEntity ? account.group.entity.id === selectedEntity.value : true
              )
              .map((account) => ({
                value: {
                  accountId: account.id,
                  entityId: account.group.entity.id,
                  currencyId: account.currency.id,
                  currency: account.currency.name,
                },
                label: `${account.accountNo} ${v.capitalize(account.type)}`,
                customLabel: account.accountNo,
              }));
          };

          const sourceAccountChange = (selectedAccount) => {
            setFieldValue("sourceAccount", selectedAccount);
            const tempEntitiesList = sourceOwners
              .filter((entity) =>
                selectedAccount ? entity.id === selectedAccount.value.entityId : true
              )
              .map((entity) => ({ value: entity.id, label: entity.corporateEntityName }));

            if (selectedAccount) {
              setFieldValue("sourceEntity", tempEntitiesList[0]);
            }

            if (selectedAccount) {
              destinationAccountsDropdown = destinationAccounts
                .filter((account) =>
                  values.destinationEntity
                    ? account.group.entity.id === values.destinationEntity.value
                    : true
                )
                .filter((account) =>
                  selectedAccount ? account.currencyId === selectedAccount.value.currencyId : true
                )
                .filter((account) =>
                  selectedAccount ? account.id !== selectedAccount.value.accountId : false
                )
                .map((account) => ({
                  value: {
                    accountId: account.id,
                    entityId: account.group.entity.id,
                    currencyId: account.currency.id,
                    currency: account.currency.name,
                  },
                  label: `${account.accountNo} ${v.capitalize(account.type)}`,
                  customLabel: account.accountNo,
                }));

              if (
                selectedAccount.value.currencyId !== values.destinationAccount?.value.currencyId
              ) {
                setFieldValue("destinationAccount", null);
              }
            }
          };

          const destinationEntityChange = (selectedEntity) => {
            setFieldValue("destinationEntity", selectedEntity);
            destinationAccountsDropdown = destinationAccounts
              .filter((account) =>
                selectedEntity ? account.group.entity.id === selectedEntity.value : true
              )
              .filter((account) =>
                values.sourceAccount
                  ? account.currencyId === values.sourceAccount.value.currencyId
                  : true
              )
              .map((account) => ({
                value: {
                  accountId: account.id,
                  entityId: account.group.entity.id,
                  currencyId: account.currency.id,
                  currency: account.currency.name,
                },
                label: `${account.accountNo} ${v.capitalize(account.type)}`,
                customLabel: account.accountNo,
              }));
          };

          const destinationAccountChange = (selectedAccount) => {
            setFieldValue("destinationAccount", selectedAccount);
            const tempEntities = destinationOwners
              .filter((entity) =>
                selectedAccount ? entity.id === selectedAccount.value.entityId : true
              )
              .map((entity) => ({ value: entity.id, label: entity.corporateEntityName }));

            if (selectedAccount) {
              sourceAccountsDropdown = sourceAccounts
                .filter((account) =>
                  values.sourceEntity ? account.group.entity.id === values.sourceEntity.value : true
                )
                .filter((account) =>
                  selectedAccount ? account.currencyId === selectedAccount.value.currencyId : true
                )
                .filter((account) =>
                  selectedAccount ? account.id !== selectedAccount.value.accountId : false
                )
                .map((account) => ({
                  value: {
                    accountId: account.id,
                    entityId: account.group.entity.id,
                    currencyId: account.currency.id,
                    currency: account.currency.name,
                  },
                  label: `${account.accountNo} ${v.capitalize(account.type)}`,
                  customLabel: account.accountNo,
                }));

              setFieldValue("destinationEntity", tempEntities[0]);
            }
          };

          const showSelectedCurrency = () => {
            let currency = "";
            // values.sourceAccount.value.currency
            if (values.sourceAccount || values.destinationAccount) {
              currency =
                values.sourceAccount?.value.currency || values.destinationAccount?.value.currency;
            }
            return currency;
          };

          return (
            <Form>
              <Grid container direction="column" spacing={2}>
                <Grid item container xs={12} md={12} lg={8}>
                  <Grid item xs={6} container direction="column" justifyContent="center">
                    <Typography>{t("Internal Transfer.Date")}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>{values.date}</Typography>
                  </Grid>
                </Grid>

                <Grid item container xs={12} md={12} lg={8}>
                  <Grid item xs={6} container direction="column" justifyContent="center">
                    <Typography>{t("Internal Transfer.Source Account Owner")}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl className={style.input__form_control}>
                      <Select
                        ref={sourceEntityRef}
                        closeMenuOnSelect
                        placeholder={t("components:Select.Select")}
                        isSearchable
                        styles={selectStyles}
                        menuPortalTarget={document.body}
                        value={values.sourceEntity}
                        isClearable
                        options={sourceEntitiesDropdown}
                        onChange={(selectedEntity) => {
                          sourceEntityChange(selectedEntity);
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid item container xs={12} md={12} lg={8}>
                  <Grid item xs={6} container direction="column" justifyContent="center">
                    <Typography>{t("Internal Transfer.Source Account")}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl className={style.input__form_control}>
                      <Select
                        ref={sourceAccountRef}
                        components={{
                          Option: ReactSelectCurrencyOption,
                        }}
                        closeMenuOnSelect
                        placeholder={t("components:Select.Select")}
                        isSearchable
                        styles={selectStyles}
                        menuPortalTarget={document.body}
                        value={values.sourceAccount}
                        isClearable
                        options={sourceAccountsDropdown}
                        onChange={(selectedAccount) => {
                          if (selectedAccount) {
                            const modifiedSelectedAccount = {
                              ...selectedAccount,
                              label: selectedAccount.customLabel,
                            };
                            sourceAccountChange(modifiedSelectedAccount);
                          } else {
                            sourceAccountChange(selectedAccount);
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid item container xs={12} md={12} lg={8}>
                  <Grid item xs={6} container direction="column" justifyContent="center">
                    <Typography>{t("Internal Transfer.Destination Account Owner")}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl className={style.input__form_control}>
                      <Select
                        ref={destinationEntityRef}
                        closeMenuOnSelect
                        // isDisabled={values.sourceAccount === null}
                        placeholder={t("components:Select.Select")}
                        isSearchable
                        styles={selectStyles}
                        menuPortalTarget={document.body}
                        value={values.destinationEntity}
                        isClearable
                        options={destinationEntitiesDropdown}
                        onChange={(selectedEntity) => {
                          destinationEntityChange(selectedEntity);
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid item container xs={12} md={12} lg={8}>
                  <Grid item xs={6} container direction="column" justifyContent="center">
                    <Typography>{t("Internal Transfer.Destination Account")}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl className={style.input__form_control}>
                      <Select
                        ref={destinationAccountRef}
                        components={{ Option: ReactSelectCurrencyOption }}
                        closeMenuOnSelect
                        // isDisabled={values.sourceAccount === null}
                        placeholder={t("components:Select.Select")}
                        isSearchable
                        styles={selectStyles}
                        menuPortalTarget={document.body}
                        value={values.destinationAccount}
                        isClearable
                        options={destinationAccountsDropdown}
                        onChange={(selectedAccount) => {
                          if (selectedAccount) {
                            const modifiedSelectedAccount = {
                              ...selectedAccount,
                              label: selectedAccount.customLabel,
                            };
                            destinationAccountChange(modifiedSelectedAccount);
                          } else {
                            destinationAccountChange(selectedAccount);
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid item container xs={12} md={12} lg={8}>
                  <Grid item xs={6} container direction="column" justifyContent="center">
                    <Typography>{t("Internal Transfer.Transfer Amount")}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      fullWidth
                      component={TextField}
                      name="transferAmount"
                      variant="filled"
                      type="number"
                      min="0"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">{showSelectedCurrency()}</InputAdornment>
                        ),
                      }}
                      // eslint-disable-next-line  react/jsx-no-duplicate-props
                      inputProps={{
                        min: 0,
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid item container xs={12} md={12} lg={8}>
                  <Grid item xs={6} container direction="column" justifyContent="center">
                    <Typography>{t("Internal Transfer.Description")}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      fullWidth
                      multiline
                      onKeyDown={(event) => {
                        if (event.which === 13)
                          setFieldValue("description", event.target.value + "\n");
                      }}
                      rows={4}
                      component={TextField}
                      name="description"
                      variant="filled"
                    />
                  </Grid>
                </Grid>

                <Grid item container xs={12} md={12} lg={8} justifyContent="flex-end">
                  <Button
                    disabled={
                      isSubmitting ||
                      values.sourceAccount === null ||
                      values.destinationAccount === null ||
                      values.transferAmount === 0
                    }
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    {t("Internal Transfer.Initiate Transfer")}
                  </Button>
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </Fragment>
  );
};

export default AccountTransferPage;
