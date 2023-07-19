import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Select from 'react-select';
import ReactSelectCurrencyOption from '../ReactSelectCurrencyOption';

import * as authSelectors from '../../redux/selectors/auth';
import * as billingAndPaymentsActionCreators from '../../redux/actionCreators/cashManagement';
import * as billingAndPaymentsSelectors from '../../redux/selectors/cashManagement';

import useWethaqAPIParams from '../../hooks/useWethaqAPIParams';

// import { addAccountSchema } from '../../validationSchemas';

import selectStyles from '../../styles/cssInJs/reactSelect';
import style from './style.module.scss';

const AssignAccountModal = ({ isModalOpen, setIsModalOpen, selectedTransaction, handleAssignAccount }) => {
  const { t } = useTranslation(['cash_management']);
  const dispatch = useDispatch();

  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityGroupID = currentEntityGroup?.id;

  const accountsData = useSelector(billingAndPaymentsSelectors.selectAccountsData);
  const sourceOwners = useSelector(billingAndPaymentsSelectors.selectSourceOwners);
  const accounts = accountsData ? accountsData.data : [];

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  const fetchAccounts = useCallback((payload) => dispatch(billingAndPaymentsActionCreators.doFetchAccounts(payload)), [dispatch]);
  const fetchSourceOwners = useCallback((payload) => dispatch(billingAndPaymentsActionCreators.doFetchSourceOwners(payload)), [dispatch]);

  useEffect(() => {
    fetchAccounts();
    fetchSourceOwners();
  }, [fetchAccounts, fetchSourceOwners]);

  const handleClose = () => {
    setIsModalOpen(false);
  };

  let accountsDropdown = accounts
    .filter((account) => account.currency.name === selectedTransaction.currency)
    .map((account) => ({
      value: { accountId: account.id, entityId: account.group.entity.id, currencyId: account.currency.id, currency: account.currency.name, original: account },
      label: account.accountNo,
    }));

  const sourceEntitiesDropdown = sourceOwners.map((entity) => ({ value: entity.id, label: entity.corporateEntityName }));

  return (
    <Formik
      initialValues={{
        paymentEntity: null,
        paymentAccount: null,
      }}
      validateOnMount={false}
      onSubmit={(values) => {
        const payload = {
          transactionId: selectedTransaction.id,
          assignedEntityGroupId: values.paymentAccount.value.original.entityGroupId,
          assignedAccountId: values.paymentAccount.value.accountId,
        };

        handleAssignAccount(payload);
        handleClose();
      }}
    >
      {({ handleSubmit, values, setFieldValue, resetForm }) => {
        const paymentEntityChange = (selectedEntity) => {
          setFieldValue('paymentEntity', selectedEntity);
          setFieldValue('paymentAccount', null);
          accountsDropdown = accounts
            .filter((account) => (selectedEntity ? account.group.entity.id === selectedEntity.value : true))
            .filter((account) => account.currency.name === selectedTransaction.currency)
            .map((account) => ({
              value: { accountId: account.id, entityId: account.group.entity.id, currencyId: account.currency.id, currency: account.currency.name, original: account },
              label: account.accountNo,
            }));
        };

        const paymentAccountChange = (selectedAccount) => {
          setFieldValue('paymentAccount', selectedAccount);
          const tempEntitiesList = sourceOwners
            .filter((entity) => (selectedAccount ? entity.id === selectedAccount.value.entityId : true))
            .map((entity) => ({ value: entity.id, label: entity.corporateEntityName }));

          if (selectedAccount) {
            setFieldValue('paymentEntity', tempEntitiesList[0]);
          }
        };

        return (
          <form onSubmit={handleSubmit} className={cx(style.formWrapper)} noValidate>
            <Dialog open={isModalOpen} onClose={handleClose} aria-labelledby="send-onboarding-invitation" maxWidth="sm" fullWidth>
              <DialogTitle id="form-dialog-title">{t('cash_management:Incoming Payments.Modals.Assign Account')}</DialogTitle>
              <DialogContent>
                <Box mb={2}>
                  <Box my={1} className="full-width">
                    <FormControl className={style.input__form_control}>
                      <Select
                        closeMenuOnSelect
                        placeholder={t('cash_management:Incoming Payments.Modals.Fields.Client')}
                        isSearchable
                        styles={selectStyles}
                        menuPortalTarget={document.body}
                        value={values.paymentEntity}
                        isClearable
                        options={sourceEntitiesDropdown}
                        onChange={(selectedEntity) => {
                          paymentEntityChange(selectedEntity);
                        }}
                      />
                    </FormControl>
                  </Box>

                  <Box my={1} className="full-width">
                    <FormControl className={style.input__form_control}>
                      <Select
                        components={{ Option: ReactSelectCurrencyOption }}
                        closeMenuOnSelect
                        placeholder={t('cash_management:Incoming Payments.Modals.Fields.Client Account')}
                        isSearchable
                        styles={selectStyles}
                        menuPortalTarget={document.body}
                        value={values.paymentAccount}
                        isClearable
                        options={accountsDropdown}
                        onChange={(selectedAccount) => {
                          paymentAccountChange(selectedAccount);
                        }}
                      />
                    </FormControl>
                  </Box>
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
                  {t('cash_management:Entity Accounts.Cancel')}
                </Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                  {t('cash_management:Entity Accounts.Submit')}
                </Button>
              </DialogActions>
            </Dialog>
          </form>
        );
      }}
    </Formik>
  );
};

AssignAccountModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default AssignAccountModal;
