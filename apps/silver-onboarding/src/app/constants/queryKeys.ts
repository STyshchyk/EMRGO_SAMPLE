import { include } from "named-urls";

export const queryKeys = {
  auth: include("/auth", {}),
  administration: include("/administration", {
    users: "users",
    roles: "roles",
  }),
  primaries: include("/primaries", {
    tradeOpportunities: include("trade-opportunities", {
      fetch: "fetch",
      documents: "documents",
      dropdown: include("dropdonwn", {
        currency: "currency",
        csd: "csd",
        custody: "custody",
        industry: "industry",
      }),
      bank: include("bank", {
        issuances: include("issuances", {
          fetch: "fetch",
          details: "details",
        }),
      }),
      sellSide: include("sellside", {
        fetch: "fetch",
      }),
      issuers: include("issuers", {
        fetch: "fetch",
      }),
    }),
  }),
  onboarding: include("onboarding", {
    fetch: "",
  }),
  document: include("/document", {
    fetch: "",
    client: "client",
    platform: "platform",
  }),
};
