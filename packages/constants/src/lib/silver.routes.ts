import { include } from "named-urls";

interface IMap {
  [key: string]: string | undefined;
}

interface IRouteObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: string | IRouteObject | any;
}

export const silverModuleURLs: IMap = {
  authentication: import.meta.env["VITE_INTERNAL_AUTH_URL"],
  administration: import.meta.env["VITE_INTERNAL_ADMINISTRATION_URL"],
  primaries: import.meta.env["VITE_INTERNAL_PRIMARIES_URL"],
  onboarding: import.meta.env["VITE_INTERNAL_ONBOARDING_URL"],
  dataroom: import.meta.env["VITE_INTERNAL_DATA_ROOM_URL"],
  custody: import.meta.env["VITE_INTERNAL_CUSTODY_URL"], // ! recheck URL once its deployed
  support: import.meta.env["VITE_INTERNAL_CUSTODY_URL"], // ! recheck URL once its deployed
};

console.debug("DEBUG VITE_BUILD_INFO (MONOREPO): ", import.meta.env["VITE_BUILD_INFO"]);
console.debug("DEBUG silverModuleURLs: ", silverModuleURLs);

export const silverAuthenticationRoutes = {
  home: "/",
  createPassword: "/create-password",
  signUp: "/signup",
  login: "/login",
  resetPassword: "/reset-password",
  resetPasswordOptions: "/reset-password-options",
  resetPasswordCodeFromAuth: "/reset-password-code-from-auth",
  resetPasswordCodeFromText: "/reset-password-code-from-text",
  resetPasswordEmailConfirmation: "/reset-password-email-confirmation",
  registrationSucess: "/registration-success",
  completeRegistration: "/complete-registration",
  verification: "/verification",
  investorProfile: "/investor-profile",
  troubleSigningIn: "/trouble-signing-in",
  troubleSigningInThanks: "/trouble-signing-in-thanks",
};
export const silverPrimariesRoutes = {
  home: "/",
  primaries: include("/primaries", {
    home: "/",
    tradeOpportunity: include("trade-opportunities", {
      home: "",
      issuances: ":id/issuances",
      manageIssuers: "manage-issuers",
      details: include(":opportunityId", {
        home: "",
      }),
      tradeTickets: ":id/trade-tickets",
      manageSellside: "manage-sellside",
    }),
    tradeManagement: include("trade-management", {
      home: "",
      tradeTickets: ":id/trade-tickets",
    }),
  }),
  secureMessaging: include("/secure-messaging", {
    inbox: include("inbox/", {
      home: "",
      id: "id/:id",
    }),
  }),
};

export const silverAdministrationRoutes = {
  home: "/",
  administration: include("/administration", {
    home: "",
    users: "users",
  }),
  secureMessaging: include("/secure-messaging", {
    inbox: include("inbox/", {
      home: "",
      id: "id/:id",
    }),
  }),
};

export const silverOnboardingRoutes = {
  home: "/",
  onboarding: include("/onboarding", {
    home: "",
    users: "users",
  }),
  secureMessaging: include("/secure-messaging", {
    inbox: include("inbox/", {
      home: "",
      id: "id/:id",
    }),
  }),
};

export const silverDataRoomRoutes = {
  home: "/",
  dataRoom: include("/data-room", {
    home: "",
    platform: "platform",
    opportunities: "opportunities",
    manageDocuments: "opportunities/manage-documents/:id/",
  }),
  secureMessaging: include("/secure-messaging", {
    inbox: include("inbox/", {
      home: "",
      id: "id/:id",
    }),
  }),
};

export const heliumCustodyRoutes = include("/dashboard", {
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
  secureMessaging: include("/secure-messaging", {
    inbox: include("inbox/", {
      home: "",
      id: "id/:id",
    }),
  }),
});

export const getAllSilverRoutes = (routesObj: IRouteObject, result: string[] = []): string[] => {
  for (const key in routesObj) {
    const value = routesObj[key];

    if (typeof value === "string") {
      result.push(value);
    } else if (typeof value === "object") {
      getAllSilverRoutes(value, result);
    }
  }

  return result;
};
