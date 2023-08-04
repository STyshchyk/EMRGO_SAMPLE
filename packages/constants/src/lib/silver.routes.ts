import { include } from "named-urls";

interface IMap {
  [key: string]: string | undefined;
}

interface IRouteObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: string | IRouteObject | any;
}

export const silverModuleURLs: IMap = {
  authentication:
    import.meta.env["VITE_INTERNAL_AUTH_URL"] ||
    "https://internal-silver-auth.exp-difc.emrgo.com/",
  administration:
    import.meta.env["VITE_INTERNAL_ADMINISTRATION_URL"] ||
    "https://internal-silver-admin.exp-difc.emrgo.com/",
  primaries:
    import.meta.env["VITE_INTERNAL_PRIMARIES_URL"] ||
    "https://internal-silver-prim.exp-difc.emrgo.com/",
  onboarding:
    import.meta.env["VITE_INTERNAL_ONBOARDING_URL"] ||
    "https://internal-silver-onboarding.exp-difc.emrgo.com/",
  dataroom:
    import.meta.env["VITE_INTERNAL_DATA_ROOM_URL"] ||
    "https://internal-silver-dataroom.exp-difc.emrgo.com/",
  custody:
    import.meta.env["VITE_INTERNAL_CUSTODY_URL"] ||
    "https://internal-helium-custody.exp-difc.emrgo.com/", // ! recheck URL once its deployed
    
};

console.debug("DEBUG VITE_BUILD_INFO (MONOREPO): ", import.meta.env["VITE_BUILD_INFO"]);
console.debug("DEBUG silverModuleURLs: ", silverModuleURLs);

export const silverAuthenticationRoutes = {
  home: "/",
  createPassword: "create-password",
  signUp: "signup",
  login: "login",
  resetPassword: "reset-password",
  resetPasswordOptions: "reset-password-options",
  resetPasswordCodeFromAuth: "reset-password-code-from-auth",
  resetPasswordCodeFromText: "reset-password-code-from-text",
  resetPasswordEmailConfirmation: "reset-password-email-confirmation",
  registrationSucess: "registration-success",
  completeRegistration: "complete-registration",
  verification: "verification",
  investorProfile: "investor-profile",
  troubleSigningIn: "trouble-signing-in",
  troubleSigningInThanks: "trouble-signing-in-thanks",
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
};

export const silverAdministrationRoutes = {
  home: "/",
  administration: include("/administration", {
    home: "",
    users: "users",
  }),
};

export const silverOnboardingRoutes = {
  home: "/",
  onboarding: include("/onboarding", {
    home: "",
    users: "users",
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
};

export const heliumCustodyRoutes = {
  home: "/dashboard",
};

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
