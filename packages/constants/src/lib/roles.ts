import { clientAccountRoutes, clientCustodyRoutes } from "./routes";

export const roles = [
  {
    label: "Administrator",
    key: "admin",
    module: "account",
    route: clientAccountRoutes.home,
    access: ["authentication", "account"],
  },
  {
    label: "Investor",
    key: "invst_mngr",
    module: "custody",
    route: clientCustodyRoutes.custody.onboarding.home,
    access: ["authentication", "primaries", "secondaries", "custody", "account", "research"],
  },
];
