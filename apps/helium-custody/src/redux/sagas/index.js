import { all } from "redux-saga/effects";

import accessControlsSaga from "./accessControlsSaga";
import accountsSaga from "./accountsSaga";
import admissionSaga from "./admissionSaga";
// eslint-disable-next-line import/no-cycle
import authSaga from "./authSaga";
import billingSaga from "./billingSaga";
import bulletinSaga from "./bulletinSaga";
import billingAndPaymentsSaga from "./cashManagementSaga";
import clientTermsSaga from "./clientTermsSaga";
import corporateActionEventsSaga from "./corporateActionEventsSaga";
import counterpartySaga from "./counterpartySaga";
import couponsSaga from "./couponsSaga";
import documentsSaga from "./documentsSaga";
import dropdownSaga from "./dropdownSaga";
import entitiesSaga from "./entitiesSaga";
import entityGroupsSaga from "./entityGroupsSaga";
import externalSecuritiesSaga from "./externalSecuritiesSaga";
import formValuesSaga from "./formValuesSaga";
import fxTransactionsSaga from "./fxTransactionsSaga";
import issuanceSaga from "./issuanceSaga";
import journalsSaga from "./journalsSaga";
import kycSaga from "./kycSaga";
import messagingSaga from "./messagingSaga";
import miscellaneousSaga from "./miscellaneousSaga";
import moduleSaga from "./moduleSaga";
import notificationSaga from "./notificationSaga";
import onboardingSaga from "./onboardingSaga";
import paymentAndSettlementSaga from "./paymentAndSettlementSaga";
import preferencesSaga from "./preferencesSaga";
import quotesSaga from "./quotesSaga";
import reportsSaga from "./reportsSaga";
import securitiesServicesSaga from "./securitiesServicesSaga";
import serviceProvidersSaga from "./serviceProvidersSaga";
import supportSaga from "./supportSaga";
import tncSaga from "./tncSaga";
import usersSaga from "./usersSaga";

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
