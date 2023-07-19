import { all } from 'redux-saga/effects';

// eslint-disable-next-line import/no-cycle
import authSaga from './authSaga';
import entitiesSaga from './entitiesSaga';
import kycSaga from './kycSaga';
import messagingSaga from './messagingSaga';
import moduleSaga from './moduleSaga';
import notificationSaga from './notificationSaga';
import serviceProvidersSaga from './serviceProvidersSaga';
import issuanceSaga from './issuanceSaga';
import paymentAndSettlementSaga from './paymentAndSettlementSaga';
import tncSaga from './tncSaga';
import clientTermsSaga from './clientTermsSaga';
import entityGroupsSaga from './entityGroupsSaga';
import miscellaneousSaga from './miscellaneousSaga';
import accountsSaga from './accountsSaga';
import documentsSaga from './documentsSaga';
import bulletinSaga from './bulletinSaga';
import supportSaga from './supportSaga';
import billingAndPaymentsSaga from './cashManagementSaga';
import accessControlsSaga from './accessControlsSaga';
import quotesSaga from './quotesSaga';
import onboardingSaga from './onboardingSaga';
import dropdownSaga from './dropdownSaga';
import reportsSaga from './reportsSaga';
import preferencesSaga from './preferencesSaga';
import usersSaga from './usersSaga';
import admissionSaga from './admissionSaga';
import securitiesServicesSaga from './securitiesServicesSaga';
import couponsSaga from './couponsSaga';
import externalSecuritiesSaga from './externalSecuritiesSaga';
import counterpartySaga from './counterpartySaga';
import fxTransactionsSaga from './fxTransactionsSaga';
import journalsSaga from './journalsSaga';
import billingSaga from './billingSaga';
import formValuesSaga from './formValuesSaga';
import corporateActionEventsSaga from './corporateActionEventsSaga';

function* watchAll() {
  yield all([
    ...authSaga,
    ...entitiesSaga,
    ...kycSaga,
    ...messagingSaga,
    ...moduleSaga,
    ...notificationSaga,
    ...serviceProvidersSaga,
    ...issuanceSaga,
    ...paymentAndSettlementSaga,
    ...tncSaga,
    ...entityGroupsSaga,
    ...miscellaneousSaga,
    ...clientTermsSaga,
    ...accountsSaga,
    ...documentsSaga,
    ...bulletinSaga,
    ...supportSaga,
    ...billingAndPaymentsSaga,
    ...accessControlsSaga,
    ...quotesSaga,
    ...onboardingSaga,
    ...dropdownSaga,
    ...reportsSaga,
    ...preferencesSaga,
    ...usersSaga,
    ...admissionSaga,
    ...securitiesServicesSaga,
    ...couponsSaga,
    ...externalSecuritiesSaga,
    ...counterpartySaga,
    ...fxTransactionsSaga,
    ...journalsSaga,
    ...billingSaga,
    ...formValuesSaga,
    ...corporateActionEventsSaga,
  ]);
}

export default watchAll;
