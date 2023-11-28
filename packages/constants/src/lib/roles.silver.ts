import {
  silverAdministrationRoutes,
  silverCustodyRoutes,
  silverOnboardingRoutes,
} from "./silver.routes";

export const silverRoles: any = [
  {
    label: "Super User",
    key: "super_user",
    module: "administration",
    route: silverAdministrationRoutes.home,
    access: ["authentication", "administration"],
  },
  {
    label: "Compliance Officer",
    key: "compliance",
    module: "onboarding",
    route: silverOnboardingRoutes.home,
    access: ["authentication", "onboarding"],
  },
  {
    label: "Operations",
    key: "operations",
    module: "custody",
    route: silverCustodyRoutes.custody.cashManagement.manageAccounts,
    access: ["authentication", "custody", "support"],
  },
  {
    label: "Relationship Manager",
    key: "relationship_manager",
    module: "custody",
    route: silverCustodyRoutes.custody.cashManagement.manageAccounts,
    access: ["authentication", "custody", "support"],
  },
  {
    label: "Finance",
    key: "finance",
    module: "custody",
    route: silverCustodyRoutes.custody.cashManagement.manageAccounts,
    access: ["authentication", "custody", "support"],
  },
];
