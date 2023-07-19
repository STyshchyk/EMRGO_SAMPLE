import { Formik, Form, Field } from 'formik';
import { TextField, RadioGroup, CheckboxWithLabel } from 'formik-material-ui';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import Radio from '@mui/material/Radio';
import Select from 'react-select';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

import { getDropdownValues } from '../../utils/form';
import { issuanceFormSchema } from '../../validationSchemas';
import { useTheme } from '../../context/theme-context';
import * as authSelectors from '../../redux/selectors/auth';
import * as issuanceActionCreators from '../../redux/actionCreators/issuance';
import appConfig from '../../appConfig';

const baseSelectStyles = {
  menu: (styles) => ({
    ...styles,
    zIndex: 10,
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  control: (styles) => ({
    ...styles,
    border: 'none',
    borderRadius: '6px',
    backgroundColor: 'rgba(0, 0, 0, 0.09)',
    height: '3rem',
  }),
  singleValue: (styles) => ({
    ...styles,
    color: '#23389c',
  }),
};

const baseSelectProps = {
  closeMenuOnSelect: true,
  isClearable: true,
  isSearchable: true,
  menuPortalTarget: document.body,
  styles: baseSelectStyles,
};

const initialValues = {
  coArrangerEntityGroup: '',
  entityGroupId: '',
  hasLegalCounsel: false,
  hasObligorIssuerInvite: false,
  hybridSukukType: '',
  isPrivatePlacement: true,
  name: '',
  pricingMethod: '',
  sukukType: '',
  ticker: '',
  version: 'production',
};

const buildRequestPayload = (formikValues) => ({
  coArrangerEntityGroupId: formikValues.coArrangerEntityGroup?.value,
  entityGroupId: formikValues.entityGroupId?.value,
  hasLegalCounsel: formikValues.hasLegalCounsel,
  hasObligorIssuerInvite: formikValues.hasObligorIssuerInvite,
  hybridSukukType: formikValues.hybridSukukType,
  isPrivatePlacement: formikValues.isPrivatePlacement,
  name: formikValues.name,
  pricingMethod: formikValues.pricingMethod?.value,
  sukukType: formikValues.sukukType?.value,
  ticker: formikValues.ticker,
  version: formikValues.version,
});

const CreateIssuanceForm = ({ handleClose, formOptions, open }) => {
  const dispatch = useDispatch();
  const currentCorporateEntityName = useSelector(authSelectors.selectCurrentCorporateEntityName);
  const { theme } = useTheme();
  const { locale } = theme;
  const { t } = useTranslation(['issuances']);

  const { clients, sukukType, pricingMethod, coArrangers } = formOptions;

  const generateObligorOptions = () => {
    const options = [];

    if (Array.isArray(clients) && clients.length > 0) {
      clients.forEach((i) => {
        options.push({ label: i.entity.corporateEntityName, value: i.id });
      });
    }

    return options;
  };

  const generateCoArrangerOptions = () => {
    const options = [];

    if (Array.isArray(coArrangers) && coArrangers.length > 0) {
      coArrangers
        .filter((i) => i.entity.corporateEntityName !== currentCorporateEntityName)
        .forEach((i) => {
          options.push({ label: i.entity.corporateEntityName, value: i.id });
        });
    }

    return options;
  };

  const handleSubmit = (values) => {
    const createIssuance = (payload) => dispatch(issuanceActionCreators.doCreateIssuance(payload));
    const requestPayload = buildRequestPayload(values);

    // alert(JSON.stringify(requestPayload, null, 2));
    createIssuance({
      requestPayload,
    });

    handleClose(false);
  };

  return (
    <Dialog open={open} onClose={() => handleClose(false)} aria-labelledby="add-issuance-form-dialog" fullWidth>
      <DialogTitle>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography
              variant="h6"
              style={{
                fontWeight: 'bold',
              }}
            >
              {t('issuances:New Issuance Modal.New Issuance')}
            </Typography>
          </Grid>
          <Grid item>
            <IconButton
              aria-label="close"
              onClick={() => {
                handleClose();
              }}
              size="large">
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent dir={locale.rtl ? 'rtl' : 'ltr'}>
        <Box mb={2}>
          <Formik initialValues={initialValues} isInitialValid={false} validationSchema={issuanceFormSchema} onSubmit={handleSubmit}>
            {({ values, setFieldValue, isSubmitting }) => (
              <Form>
                <Grid container spacing={1}>
                  <Grid item>
                    <DialogContentText
                      style={{
                        fontWeight: 'bold',
                      }}
                    >
                      {t('issuances:New Issuance Modal.Issuance Information')}
                    </DialogContentText>
                  </Grid>
                  <Grid item container spacing={1} direction="column">
                    <Grid item>
                      <Field component={TextField} label={t('issuances:New Issuance Modal.Issuance Name')} name="name" variant="filled" fullWidth />
                    </Grid>
                    <Grid item>
                      <Field component={TextField} label={t('issuances:New Issuance Modal.Ticker')} name="ticker" variant="filled" fullWidth />
                    </Grid>
                    <Grid item>
                      <Select
                        {...baseSelectProps}
                        placeholder={t('issuances:New Issuance Modal.Sukuk Type')}
                        value={values.sukukType}
                        options={getDropdownValues(sukukType, locale)}
                        onChange={(selectedSukukType) => {
                          setFieldValue('sukukType', selectedSukukType, false);
                        }}
                        aria-label="sukuktype"
                      />
                    </Grid>
                    {/* change label to arabic when translation comes in or find a different key to handle the conditional */}
                    {(values.sukukType?.label === 'Hybrid' || values.sukukType?.label === 'Hybrid_AR') && (
                      <Grid item>
                        <Field component={TextField} label={t('issuances:New Issuance Modal.Hybrid Sukuk Type')} name="hybridSukukType" variant="filled" fullWidth />
                      </Grid>
                    )}
                    <Grid item>
                      <Select
                        {...baseSelectProps}
                        placeholder={t('issuances:New Issuance Modal.Obligor')}
                        value={values.entityGroupId}
                        options={generateObligorOptions()}
                        onChange={(selectedObligor) => {
                          setFieldValue('entityGroupId', selectedObligor, false);
                        }}
                        aria-label="obligor"
                      />
                    </Grid>
                    <Grid item>
                      <Select
                        {...baseSelectProps}
                        placeholder={t(appConfig.appRegion === 'SA' ? 'issuances:New Issuance Modal.Capital Market Institution' : 'Co-Arranger')}
                        value={values.coArrangerEntityGroup}
                        options={generateCoArrangerOptions()}
                        onChange={(selected) => {
                          setFieldValue('coArrangerEntityGroup', selected, false);
                        }}
                        aria-label="coarranger"
                      />
                    </Grid>
                  </Grid>
                  <Grid item md={12}>
                    <hr
                      style={{
                        margin: '1rem 0 1rem 0',
                      }}
                    />
                  </Grid>

                  <Grid item container spacing={1}>
                    <Grid item>
                      <DialogContentText
                        style={{
                          fontWeight: 'bold',
                        }}
                      >
                        {t('issuances:New Issuance Modal.Settlement Information')}
                      </DialogContentText>
                    </Grid>

                    <Grid item container md={12} spacing={2}>
                      <Grid item container alignItems="center">
                        <Grid item container md={12} alignItems="center">
                          <Grid item>
                            <FormLabel component="legend">{t('issuances:New Issuance Modal.Version')}</FormLabel>
                          </Grid>

                          <Grid item>
                            <Field component={RadioGroup} row name="version">
                              <FormControlLabel
                                value="production"
                                style={{
                                  margin: 0,
                                }}
                                control={
                                  <Radio
                                    style={{
                                      margin: 0,
                                    }}
                                    size="small"
                                  />
                                }
                                label={t('issuances:New Issuance Modal.Production')}
                              />
                              <FormControlLabel
                                value="test"
                                style={{
                                  margin: 0,
                                }}
                                control={
                                  <Radio
                                    style={{
                                      margin: 0,
                                    }}
                                    size="small"
                                  />
                                }
                                label={t('issuances:New Issuance Modal.Test')}
                              />
                            </Field>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item container alignItems="center" spacing={1}>
                        <Grid item>
                          <FormLabel component="legend">{t('issuances:New Issuance Modal.Distribution Method')}</FormLabel>
                        </Grid>
                        <Grid item>
                          <Field component={CheckboxWithLabel} type="checkbox" name="isPrivatePlacement" Label={{ label: t('issuances:New Issuance Modal.Private Placement') }} />
                        </Grid>
                      </Grid>

                      <Grid item md={12} container direction="column" spacing={1}>
                        <Grid item>
                          <FormLabel component="legend">{t('issuances:New Issuance Modal.Engagement Settings')}</FormLabel>
                        </Grid>
                        <Grid item container direction="column">
                          <Grid item>
                            <Field component={CheckboxWithLabel} type="checkbox" name="hasLegalCounsel" Label={{ label: t('issuances:New Issuance Modal.Arranger Counsel Only') }} />
                          </Grid>
                          <Grid item>
                            <Field component={CheckboxWithLabel} type="checkbox" name="hasObligorIssuerInvite" Label={{ label: t('issuances:New Issuance Modal.Obligor Engages Issuer') }} />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item md={12} container direction="column">
                      <Grid item>
                        <Select
                          {...baseSelectProps}
                          placeholder={t('issuances:New Issuance Modal.Pricing Method')}
                          value={values.pricingMethod}
                          options={getDropdownValues(pricingMethod, locale)}
                          onChange={(selectedPricingMethod) => {
                            setFieldValue('pricingMethod', selectedPricingMethod, false);
                          }}
                          aria-label="pricingMethod"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item container spacing={2} justifyContent="flex-end">
                    <Grid item>
                      <Button
                        color="primary"
                        onClick={() => {
                          handleClose(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button color="primary" variant="contained" type="submit" disabled={isSubmitting}>
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

CreateIssuanceForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  formOptions: PropTypes.shape({
    clients: PropTypes.array,
    sukukType: PropTypes.array,
    pricingMethod: PropTypes.array,
  }).isRequired,
  open: PropTypes.bool.isRequired,
};

export default CreateIssuanceForm;
