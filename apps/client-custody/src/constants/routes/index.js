import { include } from "named-urls";

const publicUrls = include("/", {
  home: "",
  login: "login",
  onboarding: "onboarding",
  inline: "inline",
  noAccess: "no-access",
  signing: include("/signing", {
    document: "document/:token",
    success: "success",
    action: "document/success/:token/",
  }),
});

const authenticationUrls = include("/authentication", {
  registration: "registration/:token",
  success: "success",
  otp: "otp",
  forgotPassword: "forgot-password",
  reset: "reset-password/:token",
  resetMFA: "reset-mfa/:token",
  resetMFAAndPassword: "reset-mfa-password/:token",
  resetPasswordSuccess: "reset-password-success",
});

const dashboardUrls = include("/dashboard", {
  home: "",
  research: "research",
  custody: include("custody", {
    home: "",
    cashManagement: include("cash-management", {
      home: "",
      manageAccounts: "manage-accounts",
      cashStatement: "cash-statement",
      accountTransfer: "internal-transfer",
      paymentInstructions: "payment-instructions",
      incomingPayments: "incoming-payments",
    }),
    onboarding: include("onboarding", {
      home: "",
    }),
    reports: include("reports", {
      home: "",
      securities: include("securities", {
        holdings: "holdings",
        transactions: "transactions",
        referenceData: "reference-data",
      }),
      cash: include("cash", {
        balances: "balances",
        statement: "statement",
      }),
    }),
    issuerSecServices: include("issuer-securities-services", {
      home: "",
      securitiesRegistration: "securities-registration",
      custodyAndSettlement: "custody-and-settlement",
      agencyServices: "agency-services",
      registrar: "registrar",
    }),
    investorSecServices: include("investor-securities-services", {
      home: "",
      custodyAndSettlement: "custody-and-settlement",
      trusteeServices: "trustee-services",
      holdings: "holdings",
      counterpartyList: "counterparty-list",
      counterpartySSIList: "counterparty-ssi-list",
      corporateActionEvents: "corporate-action-events",
    }),
    opsSecServices: include("securities-services", {
      home: "",
      securitiesRegistration: "securities-registration",
      custodyAndSettlement: "custody-and-settlement",
      trusteeServices: "trustee-services",
      agencyServices: "agency-services",
      registrar: "registrar",
      fxTransactionList: "fx-transaction-list",
      counterpartyList: "counterparty-list",
      counterpartySSIList: "counterparty-ssi-list",
      couponAdministration: "coupon-administration",
      corporateActionEvents: "corporate-action-events",
    }),
    securitiesAdmin: include("securities-admin", {
      home: "",
      securitiesList: "securities-list",
    }),
  }),

  issuances: include("issuances", {
    home: "",
    issuance: include(":issuanceID", {
      home: "",
      overview: "overview",
      termsheet: "termsheet",
      engagements: "engagements",
      issuer: "issuer",
      investors: "investors",
      signing: "signing",
      payments: "payments",
      admissionAndSettlments: "admission-and-settlements",
      participationAndSettlments: "participation-and-settlements",
      subscription: "subscription",
      documents: "documents",
      signingAndClosing: "signing-and-closing",
      wethaqEngagements: "wethaq-engagements",
      closing: "closing",
      paymentAdministration: "payment-administration",
      cmaNotification: "cma-notification",
      speIncorporation: "spe-incorporation",
    }),
  }),
  blotters: include("blotters", {
    home: "",
  }),
  support: include("support", {
    home: "",
    tfa: "tfa",
  }),
  bulletins: include("bulletins", {
    home: "",
    view: "view",
    manage: "manage",
  }),

  settlementAdmin: include("settlement-admin", {
    home: "",
    counterpartyList: "counterparty-list",
    counterpartySSIList: "counterparty-ssi-list",
  }),
  reconciliation: include("reconciliation", {
    home: "",
  }),
  billing: include("billing", {
    home: "",
    invoices: "invoices",
    manageInvoices: "manage-invoices",
  }),
});

export default {
  public: publicUrls,
  authentication: authenticationUrls,
  dashboard: dashboardUrls,
};
