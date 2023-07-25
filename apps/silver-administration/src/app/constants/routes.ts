import { include } from "named-urls";

const routes = {
  auth: include("/", {
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
  }),
};

const dash = include("/", {
  administration: include("administration", {
    home: "",
    users: "users",
  }),
  primaries: include("primaries", {
    home: "",
    tradeOpportunityHome: "trade-opportunities",
    tradeOpportunity: include("trade-opportunities", {
      issuances: ":id/issuances",
      manageIssuers: "manage-issuers",
      manageSellside: "manage-sellside",
    }),
    tradeManagement: "trade-management",
    postTrade: "post-trade",
  }),
  onboarding: include("onboarding", {
    home: "",
    users: "users",
  }),
  dataRoom: include("data-room", {
    home: "",
    platform: "platform",
    opportunities: "opportunities",
    manageDocuments: "opportunities/manage-documents/:id",
  }),
});

export default {
  auth: routes.auth,
  dash: dash,
};
