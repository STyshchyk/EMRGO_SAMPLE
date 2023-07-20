import { include } from "named-urls";

export const queryKeys = {
  auth: include("/auth", {}),
  primaries: include("/primaries", {
    tradeOpportunities: include("trade-opportunities", {
      fetch: "fetch",
      bank: include("bank", {
        issuances: include("issuances", {
          fetch: "fetch",
          details: "details",
          documents: "documents",
        }),
      }),
    }),
  }),
  account: include("/account", {
    profile: include("profile", {
      fetch: "fetch",
    }),
    clientInvestmentProfile: include("/client-investment-profile", {
      fetch: "fetch",
    }),
    kyc: include("/kyc", {
      fetch: "fetch",
    }),
    onboardedUsers: include("/onboarder-users", {
      fetch: "fetch",
    })
  }),
  miscelleneous: include("/miscelleneous", {
    documents: include("documents", {
      fetch: "fetch",
      fetchPath: "fetch-path",
      fetchLink: "fetch-link",
    }),
    dropdowns: include("dropdowns", {
      fetch: "fetch",
    }),
  }),
};
