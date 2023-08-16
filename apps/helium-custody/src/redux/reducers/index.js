import { createRouterReducer } from "@lagunovsky/redux-react-router";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

import APP_RESET_STATES from "../actionTypes/app";
import asyncDataStore from "../configs/asyncDataStore";
import history from "../configs/history";
import accessControlsReducer from "./accessControlsReducer";
import accountsReducer from "./accountsReducer";
import authReducer from "./authReducer";
import billingReducer from "./billingReducer";
import billingAndPaymentsReducer from "./cashManagementReducer";
import clientTermsReducer from "./clientTermsReducer";
import corporateActionEventsReducer from "./corporateActionEventsReducer";
import counterpartyReducers from "./counterpartyReducer";
import couponsReducers from "./couponsReducers";
import documentsReducer from "./documentsReducer";
import dropdownReducer from "./dropdownReducers";
import entitiesReducer from "./entitiesReducer";
import entityGroupsReducer from "./entityGroupsReducer";
import externalSecuritiesReducer from "./externalSecuritiesReducer";
import formValuesReducer from "./formReducer";
import fxTransactionsReducer from "./fxTransactionsReducer";
import issuanceReducer from "./issuanceReducer";
import journalsReducer from "./journalsReducer";
import kycReducers from "./kycReducers";
import messagingReducer from "./messagingReducer";
import miscellaneousReducer from "./miscellaneousReducer";
import moduleReducer from "./moduleReducer";
import notificationReducer from "./notificationReducer";
import onboardingReducer from "./onboardingReducer";
import paymentAndSettlementReducer from "./paymentAndSettlementReducer";
import preferencesReducer from "./preferencesReducer";
import quotesReducer from "./quotesReducer";
import reportsReducer from "./reportsReducer";
import securitiesServicesReducer from "./securitiesServicesReducer";
import serviceProvidersReducer from "./serviceProvidersReducer";
import sukukReducer from "./sukukReducer";
import supportReducer from "./supportReducer";
import tncReducer from "./tncReducer";
import usersReducer from "./usersReducer";

const rootPersistConfig = {
  key: "root",
  storage: asyncDataStore,
  stateReconciler: autoMergeLevel2,
  blacklist: [
    "auth",
    "entities",
    "issuance",
    "issuers",
    "kyc",
    "messaging",
    "module",
    "notification",
    "router",
    "serviceProviders",
    "paymentAndSettlement",
    "tncReducer",
    "sukuk",
    "entityGroups",
    "support",
    "reports",
    "documents",
    "billing",
    "billingAndPayments",
  ],
};

const authPersistConfig = {
  key: "auth",
  storage: asyncDataStore,
  blacklist: [
    "isUserLoggingIn",
    "isUserLoggingOut",
    "message",
    "resetEmailID",
    "hasSuccessfullyResetPassword",
    "hasSuccessfullyRequestedPassword",
    "isRequesting",
    "errorMessage",
  ],
};

const kycPersistConfig = {
  key: "kyc",
  storage: asyncDataStore,
  whitelist: ["clientClassificationTemplateFileURL", "hasCCTemplateDownloadURL", "kycData"],
};

const entitiesPersistConfig = {
  key: "entities",
  storage: asyncDataStore,
  whitelist: ["entitiesList"],
};

const issuancePersistConfig = {
  key: "issuance",
  storage: asyncDataStore,
  whitelist: ["capitalMarketAuthorityDocumentURLs", "hasSavedTermsheet"],
};

const appReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  entities: persistReducer(entitiesPersistConfig, entitiesReducer),
  issuance: persistReducer(issuancePersistConfig, issuanceReducer),
  kyc: persistReducer(kycPersistConfig, kycReducers),
  messaging: messagingReducer,
  module: moduleReducer,
  notification: notificationReducer,
  miscellaneous: miscellaneousReducer,
  router: createRouterReducer(history),
  serviceProviders: serviceProvidersReducer,
  paymentAndSettlement: paymentAndSettlementReducer,
  tnc: tncReducer,
  sukuk: sukukReducer,
  entityGroups: entityGroupsReducer,
  clientTerms: clientTermsReducer,
  accounts: accountsReducer,
  form: formValuesReducer,
  documents: documentsReducer,
  support: supportReducer,
  billingAndPayments: billingAndPaymentsReducer,
  accessControls: accessControlsReducer,
  quotes: quotesReducer,
  onboarding: onboardingReducer,
  dropdown: dropdownReducer,
  reports: reportsReducer,
  preferences: preferencesReducer,
  users: usersReducer,
  securitiesServices: securitiesServicesReducer,
  coupons: couponsReducers,
  counterparty: counterpartyReducers,
  externalSecurities: externalSecuritiesReducer,
  fxTransactions: fxTransactionsReducer,
  journals: journalsReducer,
  billing: billingReducer,
  CAEvents: corporateActionEventsReducer,
});

export const rootReducer = (state, action) => {
  let initialState = state;

  if (action.type.includes(APP_RESET_STATES)) {
    initialState = undefined;
  }

  return appReducer(initialState, action);
};

const persistedRootReducer = persistReducer(rootPersistConfig, rootReducer);

export default persistedRootReducer;
