import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import makeAnimated from "react-select/animated";

import { MySelect as Select } from "@emrgo-frontend/shared-ui";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { ErrorMessage, Field, Formik } from "formik";
import { TextField } from "formik-mui";

import { counterpartyStatusEnum } from "../../constants/wethaqAPI/securitiesServices";
import useWethaqAPIParams from "../../hooks/useWethaqAPIParams";
import * as counterpartyActionCreators from "../../redux/actionCreators/counterparty";
import * as entitiesActionCreators from "../../redux/actionCreators/entities";
import * as formActionCreators from "../../redux/actionCreators/form";
import * as authSelectors from "../../redux/selectors/auth";
import * as counterpartySelectors from "../../redux/selectors/counterparty";
import * as entitiesSelectors from "../../redux/selectors/entities";
import * as selectFormValues from "../../redux/selectors/form";
import selectStyles from "../../styles/cssInJs/reactSelect";
import { addCounterpartyFormSchema } from "../../validationSchemas";
import AutoSaveFields from "../AutoSaveFields";

const animatedComponents = makeAnimated();

const initial = {
  entity: null,
  counterpartyId: "",
  shortName: "",
  longName: "",
  status: null,
};

const AddCounterpartyDialog = ({ open, handleClose, selectedRow, setSelectedRow }) => {
  const [initialValues, setInitialValues] = useState(initial);

  const formvalues = useSelector(selectFormValues.selectFormValues);
  const fetchingValues = useSelector(selectFormValues.formValuesFetching);
  const dispatch = useDispatch();
  const { t } = useTranslation(["counterparty", "translation"]);
  const isEdit = selectedRow !== null;

  // selectors
  const counterpartyList = useSelector(counterpartySelectors.selectCounterpartyList);
  const entitiesList = useSelector(entitiesSelectors.selectEntities);
  const index = useSelector(authSelectors.selectCurrentEntityGroupIndex);
  const groups = useSelector(authSelectors.selectOwnEntityGroups);
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityType = currentEntityGroup?.entityType;
  const opsEntityOptionsLists = entitiesList?.map((entity) => ({
    label: entity.corporateEntityName,
    value: entity.id,
  }));
  const isWethaqUser = currentEntityType === "EMRGO_SERVICES";
  const investorEntityType =
    currentEntityType === "INVESTOR"
      ? [
          {
            label: currentEntityGroup.entity.corporateEntityName,
            value: currentEntityGroup.entity.id,
          },
        ]
      : null;
  const entityOptionsList = isWethaqUser ? opsEntityOptionsLists : investorEntityType; // change options list for ops/ also initial value would be populated for inv.
  const selectedCounterparty = counterpartyList?.find(({ id }) => selectedRow?.id === id);

  const fetchCounterpartyList = () =>
    dispatch(counterpartyActionCreators.doFetchCounterpartyList());

  useWethaqAPIParams({
    currentGroupId: currentEntityGroup?.id,
  });

  useEffect(() => {
    // fetch these entities for wethaq ops
    const fetchEntities = (payload) => dispatch(entitiesActionCreators.doFetchEntities(payload));

    if (isWethaqUser) {
      fetchEntities();
    }
  }, [dispatch, isWethaqUser, currentEntityType]);

  const counterpartyStatusOptionsList = [
    {
      label: t("Counterparty.Status.Active"),
      value: counterpartyStatusEnum.ACTIVE,
    },
    {
      label: t("Counterparty.Status.Inactive"),
      value: counterpartyStatusEnum.INACTIVE,
    },
  ];

  const buildRequestPayload = (values) => {
    const requestPayload = values;

    const selectFields = ["entity", "status"];
    selectFields.forEach((field) => {
      if (requestPayload[field]) {
        requestPayload[field] = requestPayload[field].value;
      }
    });

    const entityId = requestPayload.entity;
    delete requestPayload.entity;

    return { ...requestPayload, entityId };
  };

  const getInitialEntityValue = () => {
    if (selectedRow?.entity && isWethaqUser) {
      return selectedCounterparty.entityId;
    }

    if (currentEntityType === "INVESTOR") {
      return investorEntityType[0];
    }

    return null;
  };

  useEffect(() => {
    if (selectedRow || selectedCounterparty) {
      setInitialValues({
        entity: getInitialEntityValue(),
        counterpartyId: selectedRow?.counterpartyId || "",
        shortName: selectedRow?.shortName || "",
        longName: selectedRow?.longName || "",
        status: selectedRow?.status ? selectedCounterparty.status : null,
      });
    } else {
      let values;
      if (formvalues?.settings) {
        const data = formvalues?.settings[0];
        if (
          !fetchingValues &&
          data?.value &&
          data?.value !== "null" &&
          data?.key === "CounterpartyForm"
        ) {
          values = JSON.parse(data.value);
          if (currentEntityType === "INVESTOR") {
            values = {
              ...values,
              entity: getInitialEntityValue(),
            };
          }
          setInitialValues(values);
        }
      } else if (currentEntityType === "INVESTOR") {
        values = {
          ...initialValues,
          entity: getInitialEntityValue(),
          status: counterpartyStatusOptionsList[1],
        };
        setInitialValues(values);
      }
    }
  }, [formvalues, fetchingValues, selectedCounterparty, selectedRow]);

  const saveFormValues = (value) => {
    const obj = {
      settings: [
        {
          key: "CounterpartyForm",
          value: JSON.stringify(value),
          isActive: false,
        },
      ],
    };
    dispatch(formActionCreators.doPostFormRequested(obj));
  };

  useEffect(() => {
    if (open) {
      const fetchFormValues = (payload) => dispatch(formActionCreators.doFetchForm(payload));
      fetchFormValues({ keys: ["CounterpartyForm"] });
    }
  }, [open]);

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={(event, reason) => {
        if (reason && reason === "backdropClick") return;

        handleClose();
      }}
      aria-labelledby="form-dialog-title"
      scroll="body"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={addCounterpartyFormSchema}
        enableReinitialize
        onSubmit={(values, actions) => {
          let requestPayload;
          if (isEdit) {
            const editObject = {
              requestPayload: buildRequestPayload(values),
              counterpartyId: selectedRow?.id,
            };
            requestPayload = editObject;
          } else {
            requestPayload = buildRequestPayload(values);
          }

          const payload = {
            requestPayload,
            successCallback: () => {
              actions.setSubmitting(false);
              saveFormValues(values);
              fetchCounterpartyList();
              handleClose();
              setSelectedRow(null);
            },
          };
          if (isEdit) {
            dispatch(counterpartyActionCreators.doEditCounterparty(payload));
          } else {
            dispatch(counterpartyActionCreators.doAddCounterparty(payload));
          }

          actions.setSubmitting(false);
        }}
      >
        {({ values, handleSubmit, setFieldValue }) => (
          <form onSubmit={handleSubmit}>
            <AutoSaveFields
              selectedRow={selectedRow}
              formKey="CounterpartyForm"
              initial={initial}
            />
            <DialogTitle id="form-dialog-title">
              {" "}
              {isEdit ? t("Counterparty.Edit Counterparty") : t("Counterparty.New Counterparty")}
            </DialogTitle>

            <DialogContent>
              <Box mb={2}>
                <Grid container>
                  <Grid item xs={12} lg={12} container className="mt-4">
                    <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                      <Typography className="mt-4">
                        {t("Counterparty.Add Counterparty Form.Entity")}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={6}
                      lg={6}
                      container
                      alignContent="center"
                      className="px-1"
                    >
                      <FormControl className="w-full">
                        <Select
                          isDisabled={!isWethaqUser || isEdit} // autopopulated for investor so disable it.
                          closeMenuOnSelect
                          placeholder="Select.."
                          components={{
                            ...animatedComponents,
                          }}
                          menuPortalTarget={document.body}
                          isSearchable
                          styles={selectStyles}
                          value={values.entity}
                          isClearable
                          options={entityOptionsList}
                          onChange={(selected) => {
                            setFieldValue("entity", selected);
                          }}
                        />
                      </FormControl>
                      <ErrorMessage
                        component={Typography}
                        variant="caption"
                        color="error"
                        className="ml-4"
                        name="entity"
                      />
                    </Grid>
                  </Grid>

                  <Grid item xs={12} lg={12} container className="mt-4">
                    <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                      <Typography className="mt-4">
                        {t("Counterparty.Add Counterparty Form.Counterparty ID")}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={6}
                      lg={6}
                      container
                      alignContent="center"
                      className="px-1"
                    >
                      <Field
                        fullWidth
                        component={TextField}
                        label={t("Counterparty.Add Counterparty Form.Counterparty ID")}
                        name="counterpartyId"
                        variant="filled"
                        size={"small"}
                        type="text"
                        InputProps={{ readOnly: isEdit, disableUnderline: isEdit }}
                      />
                    </Grid>
                  </Grid>

                  <Grid item xs={12} lg={12} container className="mt-4">
                    <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                      <Typography className="mt-4">
                        {t("Counterparty.Add Counterparty Form.Short Name")}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={6}
                      lg={6}
                      container
                      alignContent="center"
                      className="px-1"
                    >
                      <Field
                        fullWidth
                        component={TextField}
                        label={t("Counterparty.Add Counterparty Form.Short Name")}
                        name="shortName"
                        variant="filled"
                        size={"small"}
                        type="text"
                      />
                    </Grid>
                  </Grid>

                  <Grid item xs={12} lg={12} container className="mt-4">
                    <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                      <Typography className="mt-4">
                        {t("Counterparty.Add Counterparty Form.Long Name")}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={6}
                      lg={6}
                      container
                      alignContent="center"
                      className="px-1"
                    >
                      <Field
                        fullWidth
                        component={TextField}
                        label={t("Counterparty.Add Counterparty Form.Long Name")}
                        name="longName"
                        variant="filled"
                        size={"small"}
                        type="text"
                      />
                    </Grid>
                  </Grid>

                  <Grid item xs={12} lg={12} container className="mt-4">
                    <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                      <Typography className="mt-4">
                        {t("Counterparty.Add Counterparty Form.Status")}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={6}
                      lg={6}
                      container
                      alignContent="center"
                      className="px-1"
                    >
                      <FormControl className="w-full">
                        <Select
                          closeMenuOnSelect
                          isDisabled={currentEntityType === "INVESTOR"}
                          placeholder="Select.."
                          components={{
                            ...animatedComponents,
                          }}
                          menuPortalTarget={document.body}
                          isSearchable
                          styles={selectStyles}
                          value={values.status}
                          isClearable={currentEntityType !== "INVESTOR"}
                          options={counterpartyStatusOptionsList}
                          onChange={(selected) => {
                            setFieldValue("status", selected);
                          }}
                        />
                      </FormControl>
                      <ErrorMessage
                        component={Typography}
                        variant="caption"
                        color="error"
                        className="ml-4"
                        name="status"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>

            <DialogActions>
              <Grid container justifyContent="flex-end" className="w-full">
                <Grid item lg={4}>
                  <Button
                    fullWidth
                    onClick={() => {
                      saveFormValues(values);
                      setInitialValues(initial);
                      handleClose();
                    }}
                    color="primary"
                  >
                    {t("translation:Miscellaneous.Cancel")}
                  </Button>
                </Grid>
              </Grid>

              <Grid item lg={4}>
                <Button fullWidth type="submit" variant="contained" color="primary">
                  {t("translation:Miscellaneous.Submit")}
                </Button>
              </Grid>
            </DialogActions>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};

export default AddCounterpartyDialog;
