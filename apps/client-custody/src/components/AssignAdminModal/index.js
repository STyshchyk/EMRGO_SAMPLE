import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

import { Formik, Form } from 'formik';

const AssignAdminModal = ({ open, onClose, selectedRow, assignUserAdmin, entityId }) => {
  const { t } = useTranslation(['onboarding']);

  return (
    <Fragment>
      <Formik
        initialValues={{
          reason: '',
        }}
        // validationSchema={}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            setSubmitting(false);
          }, 2000);

          const requestPayload = {
            entityId,
            isAdmin: true,
            verified: false,
          };
          assignUserAdmin(requestPayload, selectedRow?.user ? selectedRow.user.id : selectedRow.id);
        }}
      >
        {({ handleSubmit }) => (
          <Form>
            <Dialog fullWidth open={open} onClose={onClose} aria-labelledby="form-dialog-title" PaperProps={{ className: 'overflow-y-visible' }}>
              <DialogTitle id="edit-group-types-form-dialog-title">{t('onboarding:Forms.Are you sure you want to assign user as an admin?')}</DialogTitle>
              <DialogContent className="overflow-y-visible"></DialogContent>
              <DialogActions>
                <Grid container justifyContent="flex-end" className="mx-4 mb-4">
                  <Grid item xs={12} lg={4}>
                    <Button type="submit" color="primary" fullWidth onClick={onClose}>
                      {t('onboarding:Forms.Cancel')}
                    </Button>
                  </Grid>
                  <Grid item xs={12} lg={4}>
                    <Button type="submit" variant="contained" color="primary" fullWidth onClick={handleSubmit}>
                      {t('onboarding:Forms.Assign Admin')}
                    </Button>
                  </Grid>
                </Grid>
              </DialogActions>
            </Dialog>
          </Form>
        )}
      </Formik>
    </Fragment>
  );
};

AssignAdminModal.propTypes = {};

export default AssignAdminModal;
