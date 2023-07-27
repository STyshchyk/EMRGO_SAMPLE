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
  setupMFA: "setup-mfa",
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

  administration: include("administration", {
    home: "",
    entityDetails: include("entity-details", {
      kyc: include("kyc", {
        entities: include("entities", {
          home: "",
          entity: include(":entityId", {
            home: "",
            banking: "banking",
            classification: "classification",
            clientTerms: "client-terms",
            documents: "documents",
            experience: "experience",
            identification: "identification",
            individuals: include("individuals", {
              home: "",
              individual: include(":individualId", {
                home: "details",
                setupMFA: "setup-mfa",
              }),
            }),
            entityClassification: "entity-classification",
            keyIndividuals: "key-individuals",
            overview: "overview",
            shareholders: "shareholders",
            wealth: "wealth",
          }),
        }),
      }),
    }),
    entityManagement: include("entity-management", {
      entities: include("entities", {
        home: "",
        entity: include(":entityId", {
          home: "",
          entityGroups: include("entity-groups", {
            home: "",
            entityGroup: include(":groupId", {
              entityUserAccessManagement: "entity-user-access-management",
            }),
          }),
          entityUsers: include("entity-users", {
            home: "",
          }),
          editEntityPrefs: include("edit-entity-preferences", {
            home: "",
          }),
        }),
      }),
      visitors: include("visitors", {
        home: "",
      }),
      users: include("users", {
        home: "",
      }),
    }),
    parentEntityManagement: include("parent-entity-management", {
      home: "",
    }),
    entityAccountManagement: include("entity-account-management", {
      home: "",
    }),
    tfa: include("tfa", {
      tickets: "tickets",
    }),
    userManagement: include("user-management", {
      home: "",
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
    clientRateCard: "client-rate-card",
  }),
});

export default {
  public: publicUrls,
  authentication: authenticationUrls,
  dashboard: dashboardUrls,
};
