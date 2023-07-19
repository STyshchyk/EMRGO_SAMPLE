import { useEffect, useState, createRef, Fragment } from 'react';
import * as yup from 'yup';
import MaterialTable from '@material-table/core';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import MuiTextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CloseIcon from '@mui/icons-material/Close';

import { currencyRenderer } from '../../../constants/renderers';
import MaterialTableCustomButtonRenderer from '../../MaterialTableCustomButtonRenderer';
import MaterialTableCustomDropdownRenderer from '../../MaterialTableCustomDropdownRenderer';
import ToastMessageRenderer from '../../ToastMessageRenderer';

const TransactionChargesSection = ({ modalType, selectedRow, transactionTypeOptions, securityTypeOptions, countriesLookup, localTransactionCharges, setLocalTransactionCharges }) => {
  const [transactionChargeOverrides, setTransactionChargeOverrides] = useState([]);
  const [showTransactionChargeOverridesError, setTransactionChargeOverridesError] = useState(true);

  const { t } = useTranslation(['billing']);

  // TRANSACTIONS
  const transactionTableRef = createRef();

  const transactionTableColumns = [
    {
      title: 'Transaction Type',
      field: 'transaction_type_id',
      lookup: transactionTypeOptions,
      editComponent: (props) => <MaterialTableCustomDropdownRenderer {...props} />,
    },
    {
      title: 'Security Type',
      field: 'asset_type_id',
      lookup: securityTypeOptions,
      editComponent: (props) => <MaterialTableCustomDropdownRenderer {...props} />,
    },
    {
      title: 'Security Country / ICSD',
      field: 'asset_country_icsd_id',
      lookup: countriesLookup,
      editComponent: (props) => <MaterialTableCustomDropdownRenderer {...props} />,
    },
    {
      title: 'Trx Charge',
      field: 'charge',
      initialEditValue: '',
      editComponent: (props) => <MuiTextField fullWidth label="Charge" variant="filled" value={props.value} onChange={(e) => props.onChange(e.target.value)} />,
      render: (rowData) => `$${currencyRenderer(rowData.charge)}`,
    },
    {
      title: 'Calculated Txns',
      field: 'calculated_txn',
      initialEditValue: '',
      editComponent: (props) => <MuiTextField fullWidth label="Txns" variant="filled" value={props.value} onChange={(e) => props.onChange(e.target.value)} />,
    },
    {
      title: 'Charge (USD)',
      field: 'total_amount',
      initialEditValue: '',
      editComponent: (props) => <MuiTextField fullWidth label="Total" variant="filled" value={props.value} onChange={(e) => props.onChange(e.target.value)} />,
      render: (rowData) => `$${currencyRenderer(rowData.total_amount)}`,
    },
  ];

  const handleAddTransaction = (requestPayload, resolve) => {
    setLocalTransactionCharges([...localTransactionCharges, requestPayload]);

    setTimeout(() => {
      resolve();
    }, 500);
  };

  const handleDeleteTransaction = (requestObject, resolve) => {
    const filteredTransactions = localTransactionCharges.filter((charge) => !requestObject.includes(charge.id));
    setLocalTransactionCharges([...filteredTransactions]);
    resolve();
  };

  const handleEditTransaction = (requestObject, resolve) => {
    const updatedTransactionChargeArray = [...localTransactionCharges];
    const foundIndex = updatedTransactionChargeArray.findIndex((x) => x.id === requestObject.id);
    updatedTransactionChargeArray[foundIndex] = requestObject;
    setLocalTransactionCharges([...updatedTransactionChargeArray]);

    setTimeout(() => {
      resolve();
    }, 500);
  };

  useEffect(() => {
    const overrides = [];
    localTransactionCharges.forEach((transactionCharge) => {
      const charge = Number(transactionCharge.charge);
      const noOfTransactions = Number(transactionCharge.calculated_txn);
      const calculatedTotal = charge * noOfTransactions;
      const total = Number(transactionCharge.total_amount);
      if (calculatedTotal !== total) {
        const foundTransactionType = transactionTypeOptions[transactionCharge.transaction_type_id];
        const foundSecurityType = securityTypeOptions[transactionCharge.asset_type_id];
        const foundCountry = countriesLookup[transactionCharge.asset_country_icsd_id];

        const override = {
          ...transactionCharge,
          transaction_type_name: foundTransactionType || 'Transaction type',
          asset_type_name: foundSecurityType || 'Security type',
          asset_country_icsd_name: foundCountry || 'Country/ICSD',
          calculated_total: calculatedTotal,
        };

        overrides.push(override);
      }
    });

    setTransactionChargeOverrides(overrides);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localTransactionCharges]);

  return (
    <Box my={4}>
      <MaterialTable
        title={
          <Typography variant="h6" className={transactionChargeOverrides.length > 0 ? 'text-yellow-500' : ''}>
            Transaction Charges
            {transactionChargeOverrides.length > 0 ? (
              <IconButton
                aria-label="close"
                color="inherit"
                onClick={() => {
                  setTransactionChargeOverridesError(true);
                }}
                size="large">
                <ErrorOutlineIcon fontSize="inherit" />
              </IconButton>
            ) : (
              ''
            )}
          </Typography>
        }
        columns={transactionTableColumns}
        tableRef={transactionTableRef}
        components={{
          Container: (props) => <Paper {...props} elevation={0} />,
          Action: (props) => <MaterialTableCustomButtonRenderer {...props} />,
        }}
        options={{
          // search: false,
          searchFieldVariant: 'filled',
          actionsColumnIndex: -1,
        }}
        data={localTransactionCharges}
        editable={
          modalType === 'amend'
            ? {
                onRowAdd: (newData) =>
                  new Promise((resolve, reject) => {
                    const schema = yup.object().shape({
                      transaction_type_id: yup.string().required('Transaction type is required'),
                      asset_type_id: yup.string().required('Security type is required'),
                      asset_country_icsd_id: yup.string().required('Country/ICSD is required'),
                      charge: yup.number().required('Charge is required').positive('Charge must be a positive number'),
                      calculated_txn: yup.number().required('Number of transactions is required').positive('Number of transactions must be a positive number'),
                      total_amount: yup.number().required('Total amount is required').positive('Total must be a positive number'),
                    });

                    const requestObject = {
                      id: uuidv4(),
                      isNew: true,
                      client_rate_card_id: selectedRow?.id,
                      transaction_type_id: newData?.transaction_type_id?.value,
                      asset_type_id: newData?.asset_type_id?.value,
                      asset_country_icsd_id: newData?.asset_country_icsd_id?.value,
                      charge: Number(newData?.charge),
                      calculated_txn: Number(newData?.calculated_txn),
                      total_amount: Number(newData?.total_amount),
                    };

                    schema
                      .validate(requestObject)
                      .then((valid) => {
                        if (valid) {
                          handleAddTransaction(requestObject, resolve);
                        } else {
                          toast.warning('Transaction data inputted is incomplete/invalid.', 2000);
                          reject();
                        }
                      })
                      .catch(({ errors }) => {
                        const groupedMessages = [
                          {
                            name: 'Transaction Charge Errors',
                            messages: errors?.map((error) => {
                              const errorIcon = <ErrorOutlineIcon />;
                              return {
                                text: error,
                                icon: errorIcon,
                              };
                            }),
                          },
                        ];
                        toast(<ToastMessageRenderer groupedMessages={groupedMessages} />, {
                          position: 'bottom-left',
                          closeOnClick: true,
                          autoClose: 10000,
                          limit: 1,
                        });
                        reject();
                        return {};
                      });
                  }),
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve, reject) => {
                    const schema = yup.object().shape({
                      transaction_type_id: yup.string().required('Transaction type is required'),
                      asset_type_id: yup.string().required('Security type is required'),
                      asset_country_icsd_id: yup.string().required('Country/ICSD is required'),
                      charge: yup.number().required('Charge is required').positive('Charge must be a positive number'),
                      calculated_txn: yup.number().required('Number of transactions is required').positive('Number of transactions must be a positive number'),
                      total_amount: yup.number().required('Total amount is required').positive('Total must be a positive number'),
                    });

                    const requestObject = {
                      id: oldData.id,
                      isNew: oldData?.isNew || false,
                      client_rate_card_id: selectedRow?.id,
                      transaction_type_id: newData?.transaction_type_id?.value ? newData?.transaction_type_id?.value : newData?.transaction_type_id,
                      asset_type_id: newData?.asset_type_id?.value ? newData?.asset_type_id?.value : newData?.asset_type_id,
                      asset_country_icsd_id: newData?.asset_country_icsd_id?.value ? newData?.asset_country_icsd_id?.value : newData?.asset_country_icsd_id,
                      charge: Number(newData?.charge),
                      calculated_txn: Number(newData?.calculated_txn),
                      total_amount: Number(newData?.total_amount),
                    };

                    schema
                      .validate(requestObject)
                      .then((valid) => {
                        if (valid) {
                          handleEditTransaction(requestObject, resolve);
                        } else {
                          toast.warning('Transaction data inputted is incomplete/invalid.', 2000);
                          reject();
                        }
                      })
                      .catch(({ errors }) => {
                        const groupedMessages = [
                          {
                            name: 'Transaction Charge Errors',
                            messages: errors.map((error) => {
                              const errorIcon = <ErrorOutlineIcon />;
                              return {
                                text: error,
                                icon: errorIcon,
                              };
                            }),
                          },
                        ];
                        toast(<ToastMessageRenderer groupedMessages={groupedMessages} />, {
                          position: 'bottom-left',
                          closeOnClick: true,
                          autoClose: 10000,
                          limit: 1,
                        });
                        reject();
                        return {};
                      });
                  }),
                onRowDelete: (oldData) =>
                  new Promise((resolve) => {
                    const requestObject = [oldData.id];
                    handleDeleteTransaction(requestObject, resolve);
                  }),
              }
            : {}
        }
      />
      {transactionChargeOverrides.length > 0 && showTransactionChargeOverridesError ? (
        <Fragment>
          <Alert
            severity="warning"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setTransactionChargeOverridesError(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            <AlertTitle>{t('Invoice Management.View Dialog.TransactionChargeOverrideMessageKey', { count: transactionChargeOverrides.length })}</AlertTitle>
            <ul>
              {transactionChargeOverrides.map((override) => (
                <li className="list-disc" key={override.id}>
                  <Typography>{`Total amount for the ${override.asset_type_name} ${override.transaction_type_name} in ${override.asset_country_icsd_name} should be $${currencyRenderer(
                    override.calculated_total,
                  )}`}</Typography>
                </li>
              ))}
            </ul>
          </Alert>
        </Fragment>
      ) : (
        ''
      )}
    </Box>
  );
};

export default TransactionChargesSection;
