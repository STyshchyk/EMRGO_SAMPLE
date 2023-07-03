import { include } from "named-urls";

interface IMap {
  [key: string]: string | undefined;
}

interface IRouteObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: string | IRouteObject | any;
}

export const BASE_API_URL = import.meta.env["VITE_API_URL"];

export const clientModuleURLs: IMap = {
  authentication: import.meta.env["VITE_CLIENT_AUTH_URL"],
  primaries: import.meta.env["VITE_CLIENT_PRIMARIES_URL"],
  secondaries: import.meta.env["VITE_CLIENT_SECONDARIES_URL"],
  account: import.meta.env["VITE_CLIENT_ACCOUNT_URL"],
};

console.debug("DEBUG VITE_BUILD_INFO (MONOREPO): ", import.meta.env["VITE_BUILD_INFO"]);
console.debug("DEBUG clientModuleURLs: ", clientModuleURLs);

export const clientAuthenticationRoutes = {
  home: "",
  createPassword: "/create-password",
  signUp: "/signup",
  login: "/login",
  resetPassword: "/reset-password",
  resetPasswordOptions: "/reset-password-options",
  resetPasswordCodeFromAuth: "/reset-password-code-from-auth",
  resetPasswordCodeFromText: "/reset-password-code-from-text",
  resetPasswordEmailConfirmation: "/reset-password-email-confirmation",
  registrationSucess: "/registration-success",
  investorProfile: "/investor-profile",
  troubleSigningIn: "/trouble-signing-in",
  troubleSigningInThanks: "/trouble-signing-in-thanks",
  changePasswordVerification: "/change-email",
};

export const clientPrimariesRoutes = {
  home: "/",
  tradeOpportunities: include("/trade-opportunities", {
    home: "",
    bank: include(":bankId", {
      issuances: include("issuances", {
        home: "",
        details: include(":issuanceId", {
          home: "",
          dataRoom: "data-room",
        }),
      }),
    }),
  }),
  tradeManagement: include("/trade-management", {
    home: "",
  }),
  postTrade: include("/post-trade", {
    home: "",
  }),
};

export const clientSecondariesRoutes = {
  home: "/",
};

export const clientAccountRoutes = {
  home: "/",
  poof: "/poof",
  clientInvestmentProfile: include("/client-investment-profile", {
    home: "",
    form: "form/:typeFormId",
    thankYou: "thank-you",
  }),
  kyc: include("/kyc", {
    home: "",
    form: "form/:typeFormId",
    thankYou: "thank-you",
  }),
  account: include("/account", {
    home: "",
    userDetails: "user-details",
    accountSecurity: "account-security",
    platformAccess: "platform-access",
    dataRoom: "data-room",
  }),
};

export const getAllRoutes = (routesObj: IRouteObject, result: string[] = []): string[] => {
  for (const key in routesObj) {
    const value = routesObj[key];

    if (typeof value === "string") {
      result.push(value);
    } else if (typeof value === "object") {
      getAllRoutes(value, result);
    }
  }

  return result;
};
