import PropTypes from 'prop-types';
import { Formik, Field, ErrorMessage } from 'formik';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import { TextField } from 'formik-material-ui';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

import style from './style.module.scss';
import InputField from '../InputField';
import DropdownSelect from '../DropdownSelect';
import Required from '../Required';
import regionSwitcher from '../../helpers/regions';
import selectStyles from '../../styles/cssInJs/reactSelect';
import entityTypes from '../../constants/wethaqAPI/onboarding';

const animatedComponents = makeAnimated();

const AssignEntityModal = ({ isModalOpen, handleClose, submitAssignForm, data, entities }) => {
  const { t, i18n } = useTranslation(['onboarding', 'administration']);

  const CLASSIFICATION_OPTIONS = [
    { label: t('onboarding:Market Counter-Party'), value: 'Market Counter Party' },
    { label: t('onboarding:Deemed Professional Client'), value: 'Deemed Professional Client' },
    { label: t('onboarding:Assessed Professional Client'), value: 'Assessed Professional Client' },
  ];

  const CLASSIFICATION_OPTIONS_SA = [
    // { label: t('onboarding:Capital Market Institution'), value: 'Capital Market Institution' },
    { label: t('onboarding:Qualified Client'), value: 'Qualified Client' },
    { label: t('onboarding:Institutional Client'), value: 'Institutional Client' },
  ];

  const getRoles = (type) => {
    if (!type) return [];
    if (type.value === 'SERVICE_PROVIDER') {
      return [
        { label: i18n.language === 'ar-SA' ? 'الجهة المنظمة' : 'Arranger', value: 'ARRANGER' },
        { label: i18n.language === 'ar-SA' ? 'مقدم خدمات ائتمانية' : 'Fiduciary Service Provider', value: 'FIDUCIARY_SERVICE_PROVIDER' },
        { label: i18n.language === 'ar-SA' ? 'المستشار القانوني' : 'Legal Counsel', value: 'LEGAL_COUNSEL' },
        { label: i18n.language === 'ar-SA' ? 'المستشار القانوني' : 'Broker', value: 'BROKER' },
      ];
    }
    if (type.value === 'CLIENT') {
      return [
        { label: i18n.language === 'ar-SA' ? 'الملتزم' : 'Obligor', value: 'OBLIGOR' },
        { label: i18n.language === 'ar-SA' ? 'المستثمر' : 'Investor', value: 'INVESTOR' },
      ];
    }
    return [];
  };

  const getInitialValue = () => {
    const entityType = entityTypes.filter((et) => et.value === data?.entityUserType)[0];
    const classificationOptions = regionSwitcher({
      sa: CLASSIFICATION_OPTIONS_SA,
      ae: CLASSIFICATION_OPTIONS,
    });
    const selfAssessment = classificationOptions.filter((et) => et.value === data?.selfAssessment)[0];
    const formValue = {
      firstName: data?.user?.firstName,
      lastName: data?.user?.lastName,
      entityType: entityType?.value,
      selfAssessment: selfAssessment?.value,
      role: null,
      entityName: '',
      entityId: null,
    };
    return formValue;
  };

  return (
    <Formik
      initialValues={getInitialValue()}
      validateOnMount={false}
      enableReinitialize={true}
      onSubmit={(values, { resetForm, setSubmitting }) => {
        const payloadData = {
          entityType: values?.entityType?.value,
          classification: values?.selfAssessment?.value,
          role: values?.role?.value,
        };
        if (values.entityId) {
          payloadData.entityId = values?.entityId?.value;
        }
        if (values?.entityType?.value === 'SERVICE_PROVIDER') {
          payloadData.selfAssessment = null;
        }
        if (values.entityName && values.entityName !== '') {
          payloadData.entityName = values.entityName;
        }

        submitAssignForm(payloadData, () => {
          resetForm();
          handleClose();
        });

        setTimeout(() => {
          setSubmitting(false);
        }, 2000);
      }}
    >
      {({ handleSubmit, values, setFieldValue, resetForm }) => {
        const entityTypeChange = () => {
          setFieldValue('selfAssessment', null, true);
          setFieldValue('role', null, true);
          setFieldValue('entityId', null, true);
        };

        return (
          <form onSubmit={handleSubmit} className={cx(style.formWrapper)} noValidate>
            <Dialog open={isModalOpen} onClose={handleClose} aria-labelledby="assign-role" maxWidth="sm" fullWidth>
              <DialogTitle id="form-dialog-title">{t('administration:KYC.KYCManage.AssignEntityModal.Assign & Approve')}</DialogTitle>
              <DialogContent>
                <Box mb={2}>
                  <Grid item xs={12} lg={12} container className="mt-4">
                    <Grid item xs={12} md={6} lg={4} container alignContent="flex-start">
                      <Typography className="mt-4">
                        {t(`administration:KYC.KYCManage.AssignEntityModal.First Name`)}
                        <Required />
                      </Typography>
                    </Grid>
                    <Grid xs={12} md={6} lg={8} container alignContent="center" className="px-1">
                      <Field fullWidth component={TextField} label={t(`administration:KYC.KYCManage.AssignEntityModal.First Name`)} name="firstName" variant="filled" type="text" />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} lg={12} container className="mt-4">
                    <Grid item xs={12} md={6} lg={4} container alignContent="flex-start">
                      <Typography className="mt-4">
                        {t(`administration:KYC.KYCManage.AssignEntityModal.Last Name`)}
                        <Required />
                      </Typography>
                    </Grid>
                    <Grid xs={12} md={6} lg={8} container alignContent="center" className="px-1">
                      <Field fullWidth component={TextField} label={t(`administration:KYC.KYCManage.AssignEntityModal.Last Name`)} name="lastName" variant="filled" type="text" />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} lg={12} container className="mt-4">
                    <Grid item xs={12} md={6} lg={4} container alignContent="flex-start">
                      <Typography className="mt-4">
                        {t(`administration:KYC.KYCManage.AssignEntityModal.Entity Type`)}
                        <Required />
                      </Typography>
                    </Grid>
                    <Grid xs={12} md={6} lg={8} container alignContent="center" className="px-1">
                      <FormControl className="w-full">
                        <Select
                          closeMenuOnSelect
                          isSearchable
                          placeholder={`${t('components:Select.Select')}...`}
                          components={{
                            ...animatedComponents,
                          }}
                          menuPortalTarget={document.body}
                          styles={selectStyles}
                          value={values.entityType}
                          options={entityTypes}
                          onChange={(selectedEntity) => {
                            setFieldValue('role', null, false);
                            setFieldValue('entityType', selectedEntity, false);
                          }}
                        />
                        <ErrorMessage component={Typography} variant="caption" color="error" className="ml-4" name="entityType" />
                      </FormControl>
                    </Grid>
                  </Grid>

                  {values?.entityType?.value === 'CLIENT' ? (
                    <Grid item xs={12} lg={12} container className="mt-4">
                      <Grid item xs={12} md={6} lg={4} container alignContent="flex-start">
                        <Typography className="mt-4">
                          {t(`administration:KYC.KYCManage.AssignEntityModal.Classification`)}
                          <Required />
                        </Typography>
                      </Grid>
                      <Grid xs={12} md={6} lg={8} container alignContent="center" className="px-1">
                        <FormControl className="w-full">
                          <Select
                            closeMenuOnSelect
                            isSearchable
                            placeholder={`${t('components:Select.Select')}...`}
                            components={{
                              ...animatedComponents,
                            }}
                            menuPortalTarget={document.body}
                            styles={selectStyles}
                            value={values.selfAssessment}
                            options={regionSwitcher({
                              sa: CLASSIFICATION_OPTIONS_SA,
                              ae: CLASSIFICATION_OPTIONS,
                            })}
                            onChange={(selectedEntity) => {
                              setFieldValue('selfAssessment', selectedEntity);
                            }}
                          />
                          <ErrorMessage component={Typography} variant="caption" color="error" className="ml-4" name="selfAssessment" />
                        </FormControl>
                      </Grid>
                    </Grid>
                  ) : (
                    ''
                  )}

                  <Grid item xs={12} lg={12} container className="mt-4">
                    <Grid item xs={12} md={6} lg={4} container alignContent="flex-start">
                      <Typography className="mt-4">
                        {t(`administration:KYC.KYCManage.AssignEntityModal.Role`)}
                        <Required />
                      </Typography>
                    </Grid>
                    <Grid xs={12} md={6} lg={8} container alignContent="center" className="px-1">
                      <FormControl className="w-full">
                        <Select
                          closeMenuOnSelect
                          isSearchable
                          placeholder={`${t('components:Select.Select')}...`}
                          components={{
                            ...animatedComponents,
                          }}
                          menuPortalTarget={document.body}
                          styles={selectStyles}
                          value={values.role}
                          options={values?.entityType?.roles || []}
                          onChange={(selectedEntity) => {
                            setFieldValue('role', selectedEntity);
                          }}
                        />
                        <ErrorMessage component={Typography} variant="caption" color="error" className="ml-4" name="role" />
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} lg={12} container className="mt-4">
                    <Grid item xs={12} md={6} lg={4} container alignContent="flex-start">
                      <Typography className="mt-4">
                        {t(`administration:KYC.KYCManage.AssignEntityModal.Entity Name`)}
                        <Required />
                      </Typography>
                    </Grid>
                    <Grid xs={12} md={6} lg={8} container alignContent="center" className="px-1">
                      <Field fullWidth component={TextField} label={t(`administration:KYC.KYCManage.AssignEntityModal.Entity Name`)} name="entityName" variant="filled" type="text" />
                    </Grid>
                  </Grid>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    handleClose();
                    resetForm();
                  }}
                  color="primary"
                >
                  {t('administration:KYC.KYCManage.AssignEntityModal.Cancel')}
                </Button>
                <Button onClick={handleSubmit} variant="contained" color="primary" disabled={!(values.role && (values.entityName || values.entityId))}>
                  {t('administration:KYC.KYCManage.AssignEntityModal.Assign & Approve')}
                </Button>
              </DialogActions>
            </Dialog>
          </form>
        );
      }}
    </Formik>
  );
};

AssignEntityModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  submitAssignForm: PropTypes.func.isRequired,
};

export default AssignEntityModal;
