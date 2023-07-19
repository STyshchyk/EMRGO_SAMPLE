import PropTypes from 'prop-types';
import { Formik, Field } from 'formik';
import { useTranslation } from 'react-i18next';
// import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Select from 'react-select';
import { TextField } from 'formik-material-ui';

import Datepicker from '../Datepicker';
import FileUploadField from '../FileUploadField';

import { useTheme } from '../../context/theme-context';

import style from './style.module.scss';
import { addBulletinFormSchema } from '../../validationSchemas';
import { delay, getDropdownValues } from '../../utils/form';

const ACCEPTABLE_FILE_TYPES = '.pdf';

const initialValues = {
  title: '',
  itemDate: '',
  typeId: '',
  documentId: '',
};

const CreateBulletinForm = ({ handleClose, formOptions, onSubmit, open, handleFileUpload, filesUploaded, filesUploadInProgress }) => {
  const { homepageItemType } = formOptions;
  const { t } = useTranslation(['bulletin']);
  const { theme } = useTheme();
  const { locale } = theme;

  const buildRequestPayload = (form) => ({
    ...form,
    typeId: form.typeId.value,
    itemDate: form.itemDate.format('YYYY-MM-DD'),
    documentId: filesUploaded?.documentId.key,
  });

  return (
    <Formik
      initialValues={initialValues}
      // isInitialValid={false}
      validationSchema={addBulletinFormSchema}
      onSubmit={async (values, actions) => {
        const bulletinPayload = buildRequestPayload(values);
        onSubmit(bulletinPayload);
        await delay(1000);
        actions.setSubmitting(false);
        actions.resetForm();
        handleClose(false);
      }}
    >
      {({ handleSubmit, values, setFieldValue, handleReset }) => (
        <form onSubmit={handleSubmit} noValidate>
          <Dialog open={open} onClose={() => handleClose(false)} aria-labelledby="new-bulletin" maxWidth="sm" fullWidth>
            <DialogTitle id="form-dialog-title">{t('bulletin:New Bulletin Modal.New Bulletin')}</DialogTitle>
            <DialogContent dir={locale.rtl ? 'rtl' : 'ltr'}>
              <Box mb={2}>
                <DialogContentText>{t('bulletin:New Bulletin Modal.Bulletin Information')}</DialogContentText>
                <Box my={1} className="full-width">
                  <Field component={TextField} label={t('bulletin:New Bulletin Modal.Bulletin Title')} name="title" variant="filled" fullWidth />
                </Box>
                <Box my={1} className="full-width">
                  <Datepicker label={t('bulletin:New Bulletin Modal.Bulletin Date')} name="itemDate" materialLabel fullWidth />
                </Box>
                <Box my={1} className="full-width">
                  <FormControl className={style.input__form_control}>
                    <Select
                      closeMenuOnSelect
                      placeholder={t('bulletin:New Bulletin Modal.Bulletin Type')}
                      isSearchable
                      styles={{
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
                      }}
                      menuPortalTarget={document.body}
                      value={values.typeId}
                      options={getDropdownValues(homepageItemType, locale, true)}
                      onChange={(selectedBulletinType) => {
                        setFieldValue('typeId', selectedBulletinType, false);
                      }}
                      aria-label="bulletin-type-dropdown"
                    />
                  </FormControl>
                </Box>
                <Box>
                  <FileUploadField
                    // label="Bulletin Document"
                    isLoading={filesUploadInProgress}
                    name="documentId"
                    fullWidth
                    acceptableFileTypes={ACCEPTABLE_FILE_TYPES}
                    customHandleChange={(e) => handleFileUpload({ files: e, keyName: 'documentId' })}
                  />
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  handleClose(false);
                  handleReset();
                }}
                color="primary"
              >
                {t('bulletin:New Bulletin Modal.Cancel')}
              </Button>
              <Button disabled={filesUploadInProgress} onClick={handleSubmit} variant="contained" color="primary" type="submit">
                {t('bulletin:New Bulletin Modal.Create')}
              </Button>
            </DialogActions>
          </Dialog>
        </form>
      )}
    </Formik>
  );
};

CreateBulletinForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  formOptions: PropTypes.shape({
    homepageItemType: PropTypes.array,
  }).isRequired,
  open: PropTypes.bool.isRequired,
  filesUploadInProgress: PropTypes.bool.isRequired,
  handleFileUpload: PropTypes.func.isRequired,
  filesUploaded: PropTypes.shape({
    documentId: PropTypes.string,
  }).isRequired,
};

export default CreateBulletinForm;
