import { useEffect } from 'react';
import { Formik, Form } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Select from 'react-select';
import FormControl from '@mui/material/FormControl';

import { submitPrimIssuanceSecForAdmissionFormSchema } from '../../validationSchemas';
import { useTheme } from '../../context/theme-context';
import * as admissionActionCreators from '../../redux/actionCreators/admission';
import * as authSelectors from '../../redux/selectors/auth';
import * as dropdownSelectors from '../../redux/selectors/dropdown';
import * as issuanceActionCreators from '../../redux/actionCreators/issuance';
import * as issuanceSelectors from '../../redux/selectors/issuance';
import PrimaryIssuanceDetails from '../PrimaryIssuanceDetails';
import LoadingIndicator from '../LoadingIndicator';
import useWethaqAPIParams from '../../hooks/useWethaqAPIParams';

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

export const generateCSDOptionsList = (data) => {
  if (Array.isArray(data) && data.length > 0) {
    return data.map((item) => ({
      label: item.name,
      value: item.id,
    }));
  }

  return [];
};

const initialValues = {
  csdSelectOption: null,
};

const SecuritiesRegistrationForm = ({ handleSubmit }) => {
  const { t } = useTranslation(['admission', 'securitiesRegistration', 'yup']);
  const { theme } = useTheme();

  const { locale } = theme;

  // selectors
  const dropdownOptions = useSelector(dropdownSelectors.selectDropdownOptions);
  const admissionTermsheetData = useSelector(issuanceSelectors.selectAdmissionTermsData);
  const termsheetInfoEn = useSelector(issuanceSelectors.selectTermsheetInfo);
  const termsheetInfoAr = useSelector(issuanceSelectors.selectTermsheetInfoAr);

  const termsheetInfo = locale.altLocale === 'ar-sa' ? termsheetInfoAr : termsheetInfoEn;
  const csdOptionsList = generateCSDOptionsList(dropdownOptions?.CSDOptions);

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize validationSchema={submitPrimIssuanceSecForAdmissionFormSchema}>
      {({ values, setFieldValue, resetForm, errors }) => {
        const hasCSDDropdownOptionValueBeenSelected = Boolean(values.csdSelectOption?.value);

        return (
          <Form>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <Typography>{t('securitiesRegistration:InstructionText')}</Typography>
              </Grid>
              <Grid sm={6} item>
                <FormControl fullWidth margin="normal">
                  <Select
                    {...baseSelectProps}
                    aria-label="csd-options-menu"
                    placeholder="Select Registrar..."
                    value={values.csdSelectOption}
                    options={csdOptionsList}
                    onChange={(newValue, triggeredAction) => {
                      setFieldValue('csdSelectOption', newValue);

                      if (triggeredAction.action === 'clear') {
                        resetForm();
                      }
                    }}
                  />
                  <Typography variant="caption" color="error" className="ml-4">
                    {t(errors.csdSelectOption?.transKey)}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item>
                <PrimaryIssuanceDetails termsheetInfo={termsheetInfo} admissionTermsheetData={admissionTermsheetData} />
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary" fullWidth data-testid="submit-button" type="submit" disabled={!hasCSDDropdownOptionValueBeenSelected}>
                  <Typography variant="button">{t('securitiesRegistration:SubmitButtonText')}</Typography>
                </Button>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

const SubmitForSecuritiesRegistrationDialog = ({ sukukData, open, handleClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation(['securitiesRegistration']);

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const isFetchingAdmissionTerms = useSelector(issuanceSelectors.selectFetchingAdmissionTerms);
  const isFetchingAdmissionTermsheetData = useSelector(issuanceSelectors.selectFetchingAdmissionTermsheetData);
  const isFetchingAdmissionStatus = useSelector(issuanceSelectors.selectIsFetchingStatus);
  const submittingTerms = useSelector(issuanceSelectors.selectIsSubmittingAdmissionTerms);
  const isFetchingTermsheetData = useSelector(issuanceSelectors.selectFetchingTermsheet);

  const currentEntityGroupID = currentEntityGroup?.id;
  const isLoading = isFetchingTermsheetData || isFetchingAdmissionTermsheetData || isFetchingAdmissionTerms || isFetchingAdmissionStatus;

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(() => {
    const fetchTermsheet = (payload) => dispatch(issuanceActionCreators.doFetchTermsheet(payload));
    const fetchAdmissionTermsheetData = (payload) => dispatch(issuanceActionCreators.doFetchAdmissionTermsheetData(payload));
    const fetchSukukStatus = (payload) => dispatch(issuanceActionCreators.doFetchAdmissionStatus(payload));
    const resetTermsheet = () => dispatch(issuanceActionCreators.doResetIssuanceTermsheet());

    const payload = {
      sukukId: sukukData?.id,
    };

    fetchTermsheet(payload);
    fetchAdmissionTermsheetData(payload);
    fetchSukukStatus(payload);

    return () => {
      resetTermsheet();
    };
  }, [dispatch, currentEntityGroupID, sukukData?.id]);

  const handleSubmit = (values) => {
    const submitSukukForAdmission = (payload) => dispatch(admissionActionCreators.doSubmitSukukForAdmission(payload));
    const fetchIssuancesByStatus = (payload) => dispatch(issuanceActionCreators.doFetchIssuancesByStatus(payload));

    const payload = {
      sukukId: sukukData?.id,
      requestPayload: {
        csd: values.csdSelectOption?.value,
      },
      successCallback: () => {
        fetchIssuancesByStatus({
          status: 'AdmissionSettlement',
          requestPayload: {
            columns: ['id', 'name', 'status', 'issuanceAmount', 'wsn', 'admissionStatus', 'admissionDateSubmitted', 'admissionDateAccepted', 'issueDate'],
            refColumns: ['csdName', 'currencyName', 'denominationName'],
          },
        });

        handleClose();
      },
    };

    submitSukukForAdmission(payload);
  };

  if (isLoading)
    return (
      <Grid container justifyContent="center">
        <LoadingIndicator />
      </Grid>
    );

  return (
    <Dialog
      aria-labelledby="securities-registration-dialog-title"
      disableEscapeKeyDown
      fullWidth
      maxWidth="lg"
      open={open}
      onClose={(event, reason) => {
        if (reason && reason === 'backdropClick') return;

        handleClose();
      }}
    >
      <DialogTitle>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Typography variant="h6">
              <span
                style={{
                  borderBottom: '2px solid #28ccbf',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  paddingBottom: '0.25em',
                }}
              >
                {t('securitiesRegistration:DialogTitle')}
              </span>
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
        <Typography>{sukukData?.security}</Typography>
      </DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <SecuritiesRegistrationForm handleSubmit={handleSubmit} isSubmitting={submittingTerms} handleCloseDialog={() => handleClose()} />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

SubmitForSecuritiesRegistrationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default SubmitForSecuritiesRegistrationDialog;
