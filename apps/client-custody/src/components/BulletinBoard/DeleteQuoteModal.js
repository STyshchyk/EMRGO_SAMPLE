import React from 'react';
import PropTypes from 'prop-types';
// import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';

import style from './style.module.scss';

const AddQuoteModal = ({ isModalOpen, setIsModalOpen, handleDeleteQuote, quote }) => {
  const { t } = useTranslation(['bulletin_board', 'components']);
  // const dispatch = useDispatch();

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <Formik
      initialValues={{
        quoteId: quote.id,
      }}
      enableReinitialize
      validateOnMount={false}
      onSubmit={(values, { resetForm }) => {
        const requestPayload = {
          quoteId: values.quoteId,
        };
        handleDeleteQuote(requestPayload);
        setTimeout(() => {
          handleClose();
          resetForm();
        }, 1000);
      }}
    >
      {({ handleSubmit, values, resetForm }) => (
        <form onSubmit={handleSubmit} className={cx(style.formWrapper)} noValidate>
          <Dialog open={isModalOpen} onClose={handleClose} aria-labelledby="send-onboarding-invitation" maxWidth="sm" fullWidth>
            <DialogTitle id="form-dialog-title">{t('bulletin_board:Modals.Delete Quote Modal.Delete Quote')}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">{t('bulletin_board:Modals.Delete Quote Modal.This action is non reversible! It will permanently delete the quote')}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  handleClose();
                  resetForm();
                }}
                color="primary"
              >
                {t('bulletin_board:Modals.Delete Quote Modal.Cancel')}
              </Button>
              <Button onClick={handleSubmit} variant="contained" disabled={values.issuance === null} color="primary">
                {t('bulletin_board:Modals.Delete Quote Modal.Delete')}
              </Button>
            </DialogActions>
          </Dialog>
        </form>
      )}
    </Formik>
  );
};

AddQuoteModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default AddQuoteModal;
