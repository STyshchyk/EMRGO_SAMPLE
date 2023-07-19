import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

import style from './style.module.scss';

const ViewTransactionDetailsModal = ({ isModalOpen, setIsModalOpen, selectedTransaction }) => {
  const { t } = useTranslation(['cash_management']);
  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <Dialog open={isModalOpen} onClose={handleClose} aria-labelledby="send-onboarding-invitation" maxWidth="sm" fullWidth>
      <DialogTitle id="form-dialog-title">{t('cash_management:Incoming Payments.Modals.Payment Details')}</DialogTitle>
      <DialogContent>
        <Box className={style.detailsWrapper}>
          <div dangerouslySetInnerHTML={{ __html: selectedTransaction?.detailSegments?.replace(/\n/g, '<br />') }} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            handleClose();
          }}
          color="primary"
        >
          {t('cash_management:Entity Accounts.Cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ViewTransactionDetailsModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default ViewTransactionDetailsModal;
