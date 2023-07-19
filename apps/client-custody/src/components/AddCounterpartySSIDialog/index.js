import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, Field, ErrorMessage } from 'formik';
import { TextField } from 'formik-material-ui';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { useTheme } from '../../context/theme-context';
import { getDropdownValues } from '../../utils/form';
import { addCounterpartySSIFormSchema } from '../../validationSchemas';
import selectStyles from '../../styles/cssInJs/reactSelect';
import useWethaqAPIParams from '../../hooks/useWethaqAPIParams';
import * as counterpartyActionCreators from '../../redux/actionCreators/counterparty';
import * as entitiesActionCreators from '../../redux/actionCreators/entities';
import * as entitiesSelectors from '../../redux/selectors/entities';
import * as authSelectors from '../../redux/selectors/auth';
import * as counterpartySelectors from '../../redux/selectors/counterparty';
import * as selectFormValues from '../../redux/selectors/form';
import * as formActionCreators from '../../redux/actionCreators/form';
import AutoSaveFields from '../AutoSaveFields';

const animatedComponents = makeAnimated();

const useStyles = makeStyles(() => ({
  // find a better way??
  disabledText: {
    color: '#979797',
  },
}));

const initial = {
  entity: null,
  counterparty: null,
  ssiLabel: '',
  settlementLocation: null,
  deliveryOrReceiveAgentIdType: null,
  deliveryOrReceiveIdentifier: '',
  sellerOrBuyerIdType: null,
  sellerOrBuyerIdentifier: null,
  safekeepingAccount: null,
};

const AddCounterpartySSIDialog = ({ open, handleClose, selectedRow, setSelectedRow }) => {
  const [initialValues, setInitialValues] = useState(initial);
  const formvalues = useSelector(selectFormValues.selectFormValues);
  const fetchingValues = useSelector(selectFormValues.formValuesFetching);
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation(['counterparty', 'translation']);
  const { theme } = useTheme();
  const { locale } = theme;
  const [settlementLocationIsSix, setSettlementLocationIsSix] = useState(false);
  const isEdit = selectedRow !== null;

  // selectors
  const counterpartyList = useSelector(counterpartySelectors.selectCounterpartyList);
  const counterpartySSIList = useSelector(counterpartySelectors.selectCounterpartySSIList);
  const entitiesList = useSelector(entitiesSelectors.selectEntities);
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const dropdowns = useSelector(counterpartySelectors.selectdropdownData);

  const currentEntityType = currentEntityGroup?.entityType;
  const opsEntityOptionsLists = entitiesList?.map((entity) => ({ label: entity.corporateEntityName, value: entity.id }));
  const isWethaqUser = currentEntityType === 'EMRGO_SERVICES';
  const investorEntityType = currentEntityType === 'INVESTOR' ? [{ label: currentEntityGroup.entity.corporateEntityName, value: currentEntityGroup.entity.id }] : null;
  const entityOptionsList = isWethaqUser ? opsEntityOptionsLists : investorEntityType;
  const settlementLocationOptionsList = getDropdownValues(dropdowns?.settlementLocation, locale);

  const selectedCounterpartySSI = counterpartySSIList?.find(({ id }) => selectedRow?.id === id);

  const fetchCounterpartySSIList = () => dispatch(counterpartyActionCreators.doFetchCounterpartySSIList());

  useWethaqAPIParams({
    currentGroupId: currentEntityGroup?.id,
  });

  useEffect(() => {
    const fetchEntities = (payload) => dispatch(entitiesActionCreators.doFetchEntities(payload));

    if (isWethaqUser) {
      fetchEntities();
    }
  }, [dispatch, isWethaqUser, currentEntityType]);

  useEffect(() => {
    dispatch(counterpartyActionCreators.doFetchDropdowns({ options: ['settlementLocation', 'deliveryAgentIdTypes', 'sellerIdTypes'] }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getInitialEntityValue = () => {
    if (selectedRow?.entity && isWethaqUser) {
      return selectedCounterpartySSI?.entityId;
    }

    if (currentEntityType === 'INVESTOR') {
      return investorEntityType[0];
    }

    return null;
  };

  const buildRequestPayload = (values) => {
    const requestPayload = values;

    const selectFields = ['entity', 'counterparty', 'settlementLocation', 'deliveryOrReceiveAgentIdType', 'sellerOrBuyerIdType'];
    selectFields.forEach((field) => {
      if (requestPayload[field]) {
        requestPayload[field] = requestPayload[field].value;
      }
    });

    const counterpartyId = requestPayload.counterparty;
    const settlementLocationId = requestPayload.settlementLocation;
    const deliveryAgentIdentifierTypeId = requestPayload.deliveryOrReceiveAgentIdType;
    const deliveryAgentIdentifier = requestPayload.deliveryOrReceiveIdentifier;
    const sellerIdentifierTypeId = requestPayload?.sellerOrBuyerIdType;
    const sellerIdentifier = requestPayload.sellerOrBuyerIdentifier === '' ? null : requestPayload.sellerOrBuyerIdentifier;
    const safekeepingAccount = requestPayload.safekeepingAccount === '' ? null : requestPayload.safekeepingAccount;

    delete requestPayload.entity;
    delete requestPayload.counterparty;
    delete requestPayload.settlementLocation;
    delete requestPayload.deliveryOrReceiveAgentIdType;
    delete requestPayload.deliveryOrReceiveIdentifier;
    delete requestPayload.sellerOrBuyerIdType;
    delete requestPayload.sellerOrBuyerIdentifier;

    return { ...requestPayload, counterpartyId, settlementLocationId, deliveryAgentIdentifierTypeId, deliveryAgentIdentifier, sellerIdentifierTypeId, sellerIdentifier, safekeepingAccount };
  };

  const getCounterpartyOptionsList = (entityId) => {
    if (entityId) {
      // !! Improve this maybe as O(n)
      const options = counterpartyList.filter((item) => item?.entityId?.value === entityId?.toString()).map((item) => ({ label: item?.counterpartyId, value: item?.id }));
      return options;
    }

    return [];
  };
  const getDeliveryOrReceiveAgentIdTypeOptionsList = (settlementLocationId) => {
    if (settlementLocationId) {
      const filteredOptions = dropdowns?.deliveryAgentIdTypes?.filter((item) => item?.parentId === settlementLocationId?.toString());
      const options = getDropdownValues(filteredOptions, locale);
      return options;
    }

    return [];
  };

  const getSellerOrBuyerIdTypeOptionsList = (settlementLocationId) => {
    if (settlementLocationId) {
      const filteredOptions = dropdowns?.sellerIdTypes?.filter((item) => item?.parentId === settlementLocationId?.toString());
      const options = getDropdownValues(filteredOptions, locale);
      return options;
    }

    return [];
  };

  useEffect(() => {
    if (selectedRow || selectedCounterpartySSI) {
      setInitialValues({
        entity: getInitialEntityValue(),
        counterparty: selectedRow?.counterparty ? selectedCounterpartySSI.counterpartyId : null,
        ssiLabel: selectedRow?.ssiLabel || '',
        settlementLocation: selectedRow?.settlementLocation ? selectedCounterpartySSI.settlementLocationId : null,
        deliveryOrReceiveAgentIdType: selectedRow?.deliveryOrReceiveAgentIdType ? selectedCounterpartySSI.deliveryAgentIdentifierTypeId : null,
        deliveryOrReceiveIdentifier: selectedRow?.deliveryOrReceiveIdentifier || '',
        sellerOrBuyerIdType: selectedRow?.sellerOrBuyerIdType ? selectedCounterpartySSI?.sellerIdentifierTypeId : null,
        sellerOrBuyerIdentifier: selectedRow?.sellerOrBuyerIdentifier || null,
        safekeepingAccount: selectedRow?.safekeepingAccount || null,
      });
    } else {
      let values;
      const data = formvalues?.settings[0];
      if (!fetchingValues && data?.value && data?.value !== 'null' && data?.key === 'CounterpartySSIForm') {
        values = JSON.parse(data.value);
        if (currentEntityType === 'INVESTOR') {
          values = {
            ...values,
            entity: getInitialEntityValue(),
          };
        }
        setInitialValues(values);
      } else if (currentEntityType === 'INVESTOR') {
        values = { ...initialValues, entity: getInitialEntityValue() };
        setInitialValues(values);
      }
    }
  }, [formvalues, fetchingValues, selectedCounterpartySSI, selectedRow]);

  const saveFormValues = (value) => {
    const obj = {
      settings: [
        {
          key: 'CounterpartySSIForm',
          value: JSON.stringify(value),
        },
      ],
    };
    dispatch(formActionCreators.doPostFormRequested(obj));
  };

  useEffect(() => {
    if (open) {
      const fetchFormValues = (payload) => dispatch(formActionCreators.doFetchForm(payload));
      fetchFormValues({ keys: ['CounterpartySSIForm'] });
    }
  }, [open]);

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={(event, reason) => {
        if (reason && reason === 'backdropClick') return;

        handleClose();
      }}
      aria-labelledby="form-dialog-title"
      scroll="body"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={addCounterpartySSIFormSchema}
        enableReinitialize
        onSubmit={async (values, actions) => {
          let requestPayload;

          if (isEdit) {
            const editObject = {
              requestPayload: buildRequestPayload(values),
              counterpartySSIId: selectedRow?.id,
            };
            requestPayload = editObject;
          } else {
            requestPayload = buildRequestPayload(values);
          }

          const payload = {
            requestPayload,
            successCallback: () => {
              actions.setSubmitting(false);
              saveFormValues(null);
              fetchCounterpartySSIList();
              handleClose();
              setSelectedRow(null);
            },
          };

          if (isEdit) {
            dispatch(counterpartyActionCreators.doEditCounterpartySSI(payload));
          } else {
            dispatch(counterpartyActionCreators.doAddCounterpartySSI(payload));
          }

          actions.setSubmitting(false);
          saveFormValues(null);
        }}
      >
        {({ handleSubmit, setFieldValue, values }) => {
          const counterpartyOptionsList = getCounterpartyOptionsList(values?.entity?.value);
          const deliveryOrReceiveAgentIdTypeOptionsList = getDeliveryOrReceiveAgentIdTypeOptionsList(values?.settlementLocation?.value);
          const sellerOrBuyerIdTypeOptionsList = getSellerOrBuyerIdTypeOptionsList(values?.settlementLocation?.value);
          if (values?.settlementLocation?.label === 'SIX') {
            setSettlementLocationIsSix(true);
          } else {
            setSettlementLocationIsSix(false);
          }

          return (
            <form onSubmit={handleSubmit} noValidate>
              <AutoSaveFields selectedRow={selectedRow} formKey="CounterpartySSIForm" initial={initial} />
              <DialogTitle id="form-dialog-title"> {isEdit ? t('counterparty:Counterparty SSI.Edit Counterparty SSI') : t('counterparty:Counterparty SSI.New Counterparty SSI')}</DialogTitle>
              <DialogContent>
                <Box mb={2}>
                  <Grid container>
                    <Grid item xs={12} lg={12} container className="mt-4">
                      <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                        <Typography className="mt-4">{t('counterparty:Counterparty SSI.Add Counterparty SSI Form.Entity')}</Typography>
                      </Grid>

                      <Grid item xs={12} md={6} lg={6} container alignContent="center" className="px-1">
                        <FormControl className="w-full">
                          <Select
                            isDisabled={!isWethaqUser || isEdit} // autoppulated for investor so disable it.
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
                              setFieldValue('counterparty', null);
                              setFieldValue('entity', selected);
                            }}
                          />
                        </FormControl>
                        <ErrorMessage component={Typography} variant="caption" color="error" className="ml-4" name="entity" />
                      </Grid>
                    </Grid>

                    <Grid item xs={12} lg={12} container className="mt-4">
                      <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                        <Typography className="mt-4">{t('counterparty:Counterparty SSI.Add Counterparty SSI Form.Counterparty')}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6} lg={6} container alignContent="center" className="px-1">
                        <FormControl className="w-full">
                          <Select
                            isDisabled={isEdit}
                            closeMenuOnSelect
                            placeholder="Select.."
                            components={{
                              ...animatedComponents,
                            }}
                            menuPortalTarget={document.body}
                            isSearchable
                            styles={selectStyles}
                            value={values.counterparty}
                            isClearable
                            options={counterpartyOptionsList}
                            onChange={(selected) => {
                              setFieldValue('counterparty', selected);
                            }}
                          />
                        </FormControl>
                        <ErrorMessage component={Typography} variant="caption" color="error" className="ml-4" name="counterparty" />
                      </Grid>
                    </Grid>

                    <Grid item xs={12} lg={12} container className="mt-4">
                      <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                        <Typography className="mt-4">{t('counterparty:Counterparty SSI.Add Counterparty SSI Form.SSI Label')}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6} lg={6} container alignContent="center" className="px-1">
                        <Field fullWidth component={TextField} label="SSI Label" name="ssiLabel" variant="filled" type="text" />
                      </Grid>
                    </Grid>

                    <Grid item xs={12} lg={12} container className="mt-4">
                      <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                        <Typography className="mt-4">{t('counterparty:Counterparty SSI.Add Counterparty SSI Form.Settlement Location')}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6} lg={6} container alignContent="center" className="px-1">
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
                            value={values.settlementLocation}
                            isClearable
                            options={settlementLocationOptionsList}
                            onChange={(selected) => {
                              // if (selected?.label === 'SIX') {
                              //   setSettlementLocationIsSix(true);
                              // } else {
                              //   setSettlementLocationIsSix(false);
                              // }
                              setFieldValue('settlementLocation', selected);
                              setFieldValue('deliveryOrReceiveAgentIdType', null); // as the options are dependent on settlement location
                              setFieldValue('sellerOrBuyerIdType', null);
                              setFieldValue('deliveryOrReceiveIdentifier', '');
                              setFieldValue('sellerOrBuyerIdentifier', ''); // clear it when on amended from euroclear/clearstream to SIX
                              setFieldValue('safekeepingAccount', '');
                            }}
                          />
                        </FormControl>
                        <ErrorMessage component={Typography} variant="caption" color="error" className="ml-4" name="settlementLocation" />
                      </Grid>
                    </Grid>

                    <Grid item xs={12} lg={12} container className="mt-4">
                      <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                        <Typography className="mt-4">{t('counterparty:Counterparty SSI.Add Counterparty SSI Form.DeliveryOrReceive Agent ID Type')}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6} lg={6} container alignContent="center" className="px-1">
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
                            value={values.deliveryOrReceiveAgentIdType}
                            isClearable
                            options={deliveryOrReceiveAgentIdTypeOptionsList || []}
                            onChange={(selected) => {
                              setFieldValue('deliveryOrReceiveAgentIdType', selected);
                              setFieldValue('deliveryOrReceiveIdentifier', '');
                            }}
                          />
                        </FormControl>
                        <ErrorMessage component={Typography} variant="caption" color="error" className="ml-4" name="deliveryOrReceiveAgentIdType" />
                      </Grid>
                    </Grid>

                    <Grid item xs={12} lg={12} container className="mt-4">
                      <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                        <Typography className="mt-4">{t('counterparty:Counterparty SSI.Add Counterparty SSI Form.DeliveryOrReceive Agent Identifier')}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6} lg={6} container alignContent="center" className="px-1">
                        <Field
                          fullWidth
                          component={TextField}
                          label={t('counterparty:Counterparty SSI.Add Counterparty SSI Form.DeliveryOrReceive Agent Identifier')}
                          name="deliveryOrReceiveIdentifier"
                          variant="filled"
                          type="text"
                        />
                      </Grid>
                    </Grid>

                    <Grid item xs={12} lg={12} container className="mt-4">
                      <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                        <Typography className={`mt-4 ${settlementLocationIsSix && classes.disabledText}`}>
                          {t('counterparty:Counterparty SSI.Add Counterparty SSI Form.SellerOrBuyer ID Type')}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6} lg={6} container alignContent="center" className="px-1">
                        <FormControl className="w-full">
                          <Select
                            isDisabled={settlementLocationIsSix}
                            closeMenuOnSelect
                            placeholder="Select.."
                            components={{
                              ...animatedComponents,
                            }}
                            menuPortalTarget={document.body}
                            isSearchable
                            styles={selectStyles}
                            value={values.sellerOrBuyerIdType}
                            isClearable
                            options={sellerOrBuyerIdTypeOptionsList}
                            onChange={(selected) => {
                              setFieldValue('sellerOrBuyerIdType', selected);
                              setFieldValue('sellerOrBuyerIdentifier', '');
                            }}
                          />
                        </FormControl>
                        <ErrorMessage component={Typography} variant="caption" color="error" className="ml-4" name="sellerOrBuyerIdType" />
                      </Grid>
                    </Grid>

                    <Grid item xs={12} lg={12} container className="mt-4">
                      <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                        <Typography className={`mt-4 ${settlementLocationIsSix && classes.disabledText}`}>
                          {t('counterparty:Counterparty SSI.Add Counterparty SSI Form.SellerOrBuyer Identifier')}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6} lg={6} container alignContent="center" className="px-1">
                        <Field
                          fullWidth
                          component={TextField}
                          label={t('counterparty:Counterparty SSI.Add Counterparty SSI Form.SellerOrBuyer Identifier')}
                          name="sellerOrBuyerIdentifier"
                          variant="filled"
                          type="text"
                          disabled={settlementLocationIsSix || !values?.sellerOrBuyerIdType?.value} // No input accepted if Seller/Buyer ID Type is <Blank>
                        />
                      </Grid>
                    </Grid>

                    <Grid item xs={12} lg={12} container className="mt-4">
                      <Grid item xs={12} md={6} lg={6} container alignContent="flex-start">
                        <Typography className={`mt-4 ${settlementLocationIsSix && classes.disabledText}`}>
                          {t('counterparty:Counterparty SSI.Add Counterparty SSI Form.Safekeeping Account')}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6} lg={6} container alignContent="center" className="px-1">
                        <Field
                          fullWidth
                          component={TextField}
                          label={t('counterparty:Counterparty SSI.Add Counterparty SSI Form.Safekeeping Account')}
                          name="safekeepingAccount"
                          variant="filled"
                          type="text"
                          disabled={settlementLocationIsSix}
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
                        saveFormValues(null);
                        setInitialValues(initial);
                        handleClose();
                      }}
                      color="primary"
                    >
                      {t('translation:Miscellaneous.Cancel')}
                    </Button>
                  </Grid>
                </Grid>

                <Grid item lg={4}>
                  <Button fullWidth type="submit" variant="contained" color="primary">
                    {t('translation:Miscellaneous.Submit')}
                  </Button>
                </Grid>
              </DialogActions>
            </form>
          );
        }}
      </Formik>
    </Dialog>
  );
};

export default AddCounterpartySSIDialog;
