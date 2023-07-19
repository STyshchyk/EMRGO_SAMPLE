import { useEffect, Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

import Blotter from '../Blotter';

import style from './style.module.scss';

const BlotterList = ({ paymentDetails, blotters, userID, createBlotter, updateBlotter, deleteBlotter, settleTrade, currentEntityGroup, firstLoadFlag, approveTrade }) => {
  const currentGroupId = currentEntityGroup?.id;
  const { t } = useTranslation();

  const [openTooltip, setOpenTooltip] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenTooltip(false);
  };

  const defaultValues = {
    action: '',
    id: '',
    sukukId: '',
    entityId: '',
    subscriptionAmount: '',
    status: '',
    createdAt: '',
    updatedAt: '',
    sukuk: {
      id: '',
      name: '',
      issuanceAmount: '',
      maturityAmount: '',
      issuePrice: '',
      profitRate: '',
      wsn: '',
      isin: '',
      underlyingAssets: '',
      tradeDate: '',
      issueDate: '',
      maturityDate: '',
      issuerSPV: '',
      status: '',
      ticker: '',
      hybridSukukType: '',
      currencyName: {
        name: '',
      },
      distributionMethodName: {
        name: '',
      },
      projectTeam: [
        {
          userId: '',
          user: {
            id: '',
            email: '',
            firstName: '',
            lastName: '',
            hashedPassword: '',
            isVerified: true,
            createdAt: '',
            updatedAt: '',
            tncStatus: 0,
            MFAEnabled: false,
            MFAType: null,
            MFASecret: null,
            role: '',
            middleName: null,
            displayRole: '',
            isEntityAdmin: true,
            isActive: true,
            userAddedById: '',
            entityId: '',
            lastLoginTime: null,
            entity: {
              id: '',
              corporateEntityName: '',
              legalIdentifier: '',
              entityType: '',
              isActive: true,
              createdAt: '',
              updatedAt: '',
              kycId: '',
              isParentEntity: false,
              isValidated: true,
              userAddedBy: '',
              tncStatus: 0,
              kyc: {
                otherAddresses: [],
              },
            },
          },
        },
        {
          userId: '',
          user: {
            id: '',
            email: '',
            firstName: '',
            lastName: '',
            hashedPassword: '',
            isVerified: true,
            createdAt: '',
            updatedAt: '',
            tncStatus: 0,
            MFAEnabled: false,
            MFAType: null,
            MFASecret: null,
            role: '',
            middleName: null,
            displayRole: '',
            isEntityAdmin: true,
            isActive: true,
            userAddedById: '',
            entityId: '',
            lastLoginTime: '',
            entity: {
              id: '',
              corporateEntityName: '',
              legalIdentifier: '',
              entityType: '',
              isActive: true,
              createdAt: '',
              updatedAt: '',
              kycId: '',
              isParentEntity: false,
              isValidated: true,
              userAddedBy: '',
              tncStatus: 0,
              kyc: {
                otherAddresses: [],
              },
            },
          },
        },
      ],
      jurisdictionName: {
        name: '',
      },
      denominationName: {
        value: '',
      },
      profitRateTermsName: {
        name: '',
      },
      frequencyName: {
        name: '',
        value: '',
      },
      dayCountConventionName: {
        name: '',
      },
      sukukTypeName: {
        name: '',
      },
      sellingRestrictionsName: {
        name: '',
      },
      trades: [
        {
          id: '',
          sukukId: '',
          type: '',
          status: '',
          direction: '',
          createdAt: '',
          updatedAt: '',
          clientEntityID: '',
          dealerEntityId: '',
        },
        {
          id: '',
          sukukId: '',
          type: '',
          status: '',
          direction: '',
          createdAt: '',
          updatedAt: '',
          clientEntityID: '',
          dealerEntityId: '',
        },
      ],
      country: null,
      securityStatus: '',
      nextCouponDate: '',
      entityName: '',
      entityId: '',
      userId: '',
      dealerName: '',
      dealerId: '',
      securityShortName: '',
      trade: [
        {
          id: '',
          sukukId: '',
          type: '',
          status: '',
          direction: '',
          createdAt: '',
          updatedAt: '',
          clientEntityID: '',
          dealerEntityId: '',
        },
      ],
    },
    netSettleAmount: '',
    numOfCertificates: '',
    readyToSettle: false,
    investorEntity: {
      id: '',
      corporateEntityName: '',
      legalIdentifier: '',
      entityType: '',
      isActive: true,
      createdAt: '',
      updatedAt: '',
      kycId: '',
      isParentEntity: false,
      isValidated: true,
      userAddedBy: '',
      tncStatus: 0,
      wethaqAccount: {
        id: '',
        clientName: '',
        accountName: '',
        accountBalance: '',
        accountNumber: '',
        IBAN: '',
        currency: '',
        branch: '',
        country: '',
        status: '',
        createdAt: '',
        updatedAt: '',
        entityId: '',
        sukukId: '',
        type: '',
      },
    },
    dealer: {
      id: '',
      corporateEntityName: '',
      legalIdentifier: '',
      entityType: '',
      isActive: true,
      createdAt: '',
      updatedAt: '',
      kycId: '',
      isParentEntity: false,
      isValidated: true,
      userAddedBy: '',
      tncStatus: 0,
      wethaqAccount: {
        id: '',
        clientName: '',
        accountName: '',
        accountBalance: '',
        accountNumber: '',
        IBAN: '',
        currency: '',
        branch: '',
        country: '',
        status: '',
        createdAt: '',
        updatedAt: '',
        entityId: '',
        sukukId: '',
        type: '',
      },
    },
    settlementStatus: '',
    settlementType: '',
  };

  const currencyArray = [];
  const countryArray = [];

  const keyedData = paymentDetails.map((value) => {
    const sukukObject = value;
    currencyArray.push(sukukObject.sukuk.currencyName);
    countryArray.push(sukukObject.sukuk.countryObject);
    let newObject = {};
    Object.keys(sukukObject).forEach((key) => {
      if (sukukObject[key] !== null) {
        newObject[key] = sukukObject[key];
      }
    });

    if (newObject.dealer.wethaqAccount === null) {
      newObject = {
        ...newObject,
        dealer: {
          ...newObject.dealer,
          wethaqAccount: {
            id: '',
            clientName: '',
            accountName: '',
            accountBalance: '',
            accountNumber: '',
            IBAN: '',
            currency: '',
            branch: '',
            country: '',
            status: '',
            createdAt: '',
            updatedAt: '',
            entityId: '',
            sukukId: '',
            type: '',
          },
        },
      };
    }

    if (newObject.investorEntity.wethaqAccount === null) {
      newObject = {
        ...newObject,
        investorEntity: {
          ...newObject.investorEntity,
          wethaqAccount: {
            id: '',
            clientName: '',
            accountName: '',
            accountBalance: '',
            accountNumber: '',
            IBAN: '',
            currency: '',
            branch: '',
            country: '',
            status: '',
            createdAt: '',
            updatedAt: '',
            entityId: '',
            sukukId: '',
            type: '',
          },
        },
      };
    }

    return {
      ...defaultValues,
      ...newObject,
    };
  });

  const createNewBlotter = () => {
    if (blotters.length < 2) {
      const blotterList = [
        ...blotters,
        {
          id: uuidv4(),
          userId: userID,
          key: {
            parameters: {
              name: t('blotter:Default Blotter'),
              filters: {},
              manualColumnMove: [],
            },
          },
        },
      ];

      const blotterConfig = blotterList.map((blotter) => ({
        id: blotter.id,
        key: JSON.stringify(blotter.key),
      }));

      const requestObject = {
        data: {
          blotters: [...blotterConfig],
        },
        params: {
          currentGroupId,
        },
      };

      createBlotter(requestObject);
    } else {
      setOpenTooltip(true);
    }
  };

  const updateSingleBlotter = (blotterId, config) => {
    const blotterConfig = blotters.map((blotter) => {
      let newObject = {
        id: blotter.id,
        key: JSON.stringify(blotter.key),
      };
      if (blotter.id === blotterId) {
        newObject = {
          id: blotterId,
          key: JSON.stringify({
            parameters: {
              name: config.name,
              filters: {
                ...config,
              },
              manualColumnMove: config.columnOrder,
            },
          }),
        };
      }
      return newObject;
    });

    const requestObject = {
      data: {
        blotters: [...blotterConfig],
      },
      params: {
        currentGroupId,
      },
    };
    updateBlotter(requestObject);
  };

  const deleteSingleBlotter = (blotterId) => {
    const blotterConfig = blotters.map((blotter) => {
      let newObject = {
        id: blotter.id,
        key: JSON.stringify(blotter.key),
      };
      if (blotter.id === blotterId) {
        newObject = {
          id: blotterId,
        };
      }
      return newObject;
    });

    const requestObject = {
      data: {
        blotters: [...blotterConfig],
      },
      params: {
        currentGroupId,
      },
    };
    deleteBlotter(requestObject);
  };

  const uniqueArray = {};

  const uniqueCurrencies = Array.from(new Set(currencyArray.map((s) => s.name))).map((name) => ({
    name,
    label: currencyArray.find((s) => s.name === name).label,
  }));

  const uniqueCountries = [];
  Array.from(new Set(countryArray.map((s) => (s === null ? false : s.name)))).map((name) => {
    if (name) {
      uniqueCountries.push({
        name,
        label: countryArray.find((s) => s?.name === name).label,
      });
    }

    return true;
  });

  uniqueArray.currency = uniqueCurrencies;
  uniqueArray.country = uniqueCountries;

  useEffect(() => {
    if (blotters.length === 0 && firstLoadFlag) {
      createNewBlotter();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstLoadFlag]);

  return (
    <div className={style.container}>
      <div className="w-100 d-flex justify-content-end">
        <div className={style['action-button']}>
          {/* <Link key={shortid.generate()} to={routes.paymentsAndSettlements.manage}>
            <button className="btn btn--primary btn--thin" type="button" to={routes.paymentsAndSettlements.manage} onClick={() => {}}>
              <span className="btn-text">Manage Payment Details</span>
            </button>
          </Link> */}
        </div>
      </div>
      {blotters.length > 0 && (
        <Fragment>
          {blotters.map((blotter) => (
            <Fragment key={blotter.id}>
              <Blotter
                updateSingleBlotter={updateSingleBlotter}
                deleteSingleBlotter={deleteSingleBlotter}
                keyedData={keyedData}
                blotterId={blotter.id}
                parameters={blotter.key.parameters}
                blotterDropdowns={uniqueArray}
                settleTrade={settleTrade}
                approveTrade={approveTrade}
                currentEntityGroup={currentEntityGroup}
              />
            </Fragment>
          ))}
        </Fragment>
      )}

      {blotters.length > 0 ? (
        <Grid container>
          <Button
            onClick={() => {
              createNewBlotter();
            }}
            startIcon={<AddIcon />}
            fullWidth
            variant="outlined"
            color="secondary"
          >
            {t('blotter:Add Blotter')}
          </Button>
        </Grid>
      ) : (
        <Typography variant="h6" align="center">
          {t('blotter:Please add a Blotter to view Settlement Data')}
        </Typography>
      )}

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={openTooltip}
        autoHideDuration={4000}
        onClose={handleClose}
        message={t('blotter:Only two Blotters are allowed per user')}
        action={
          <Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Fragment>
        }
      />
    </div>
  );
};

BlotterList.propTypes = {
  createBlotter: PropTypes.func.isRequired,
  userID: PropTypes.string.isRequired,
  paymentDetails: PropTypes.arrayOf(PropTypes.object),
  blotters: PropTypes.arrayOf(PropTypes.object),
  blotterDropdowns: PropTypes.shape({
    currency: PropTypes.array,
    country: PropTypes.array,
  }),
  updateBlotter: PropTypes.func.isRequired,
  deleteBlotter: PropTypes.func.isRequired,
  settleTrade: PropTypes.func.isRequired,
  approveTrade: PropTypes.func.isRequired,
  currentEntityGroup: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
  firstLoadFlag: PropTypes.bool,
};

BlotterList.defaultProps = {
  paymentDetails: [],
  blotters: [],
  blotterDropdowns: {
    currency: [],
    country: [],
  },
  firstLoadFlag: false,
};

export default BlotterList;
