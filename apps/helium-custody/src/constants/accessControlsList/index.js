// * TODO - UPDATE THOSE ACL OBJECTS

const ISSUANCE = {
  create: {
    displayName: "Create Issuance",
    key: "Issuance/Create",
  },
  view: {
    displayName: "View Issuance",
    key: "Issuance/View",
  },
};

const TERMSHEET = {
  edit: {
    displayName: "Edit Termsheet",
    key: "Termsheet/Edit",
  },
  view: {
    displayName: "View Termsheet",
    key: "Termsheet/View",
  },

  approve: {
    displayName: "Approve Termsheet",
    key: "Termsheet/Approve",
  },
};


const KYC = {
  view: {
    displayName: "View KYC",
    key: "KYC/View",
  },
  edit: {
    displayName: "Edit KYC",
    key: "KYC/Edit",
  },
  manage: {
    displayName: "Manage KYC",
    key: "KYC/Manage",
  },
  invite: {
    displayName: "Invite Issuer/Originator to the platform",
    key: "KYC/Invite",
  },
};

const SUBSCRIPTION = {
  view: {
    displayName: "View Pre-Allocation",
    key: "Subscription/View",
  },
  allocate: {
    displayName: "Allocate Pre-Allocation",
    key: "Subscription/Allocate",
  },
  confirm: {
    displayName: "Confirm Pre-Allocation",
    key: "Subscription/Confirm",
  },
};

const ENGAGEMENT = {
  view: {
    displayName: "View Engagement",
    key: "Engagement/View",
  },
  engage: {
    displayName: "Allow Engagement",
    key: "Engagement/Engage",
  },
  manage: {
    displayName: "Manage Engagement",
    key: "Engagement/Manage",
  },
};

const ADMISSION = {
  view: {
    displayName: "View Admissions",
    key: "Admission/View",
  },
  approve: {
    displayName: "Approve Admission",
    key: "Admission/Approve",
  },
  finalize: {
    displayName: "Finalize Admission",
    key: "Admission/Finalize",
  },
};

const PARTICIPATION = {
  view: {
    displayName: "View Participation",
    key: "Participation/View",
  },
  approve: {
    displayName: "Approve Participation",
    key: "Participation/Approve",
  },
  finalize: {
    displayName: "Finalize Participation",
    key: "Participation/Finalize",
  },
};

const GROUP_MANAGEMENT = {
  view: {
    displayName: "View Group Management",
    key: "GroupManagement/View",
  },
  edit: {
    displayName: "Edit Group Management",
    key: "GroupManagement/Edit",
  },
};

const SIGNING = {
  view: {
    displayName: "View Signing",
    key: "Signing/View",
  },
  sign: {
    displayName: "Sign Signing",
    key: "Signing/Sign",
  },
  edit: {
    displayName: "Signing flow management",
    key: "Signing/Edit",
  },
};


const SUPPORT_TICKET_MANAGEMENT = {
  manage: {
    displayName: "Manage support tickets",
    key: "Support/Auth",
  },
};

const ACCOUNT = {
  edit: {
    displayName: "Edit Accounts",
    key: "Account/Edit",
  },
  validate: {
    display: "Validate Accounts",
    key: "Account/Validate",
  },
  manage: {
    display: "Manage Accounts",
    key: "Account/Manage",
  },
};

const PAYMENT = {
  administrate: {
    displayName: "Investor Payment Administration",
    key: "Payment/Admin",
  },
  approve: {
    displayName: "Admin Approve Incoming/Outgoing Payments",
    key: "Payment/Approve",
  },
};

const QUOTES = {
  manage: {
    displayName: "Manage Secondary Trade Quotes",
    key: "Quotes/Manage",
  },
  view: {
    displayName: "Manage Secondary Trade Quotes",
    key: "Quotes/View",
  },
};

const REPORTS = {
  manage: {
    displayName: "View Reports",
    key: "Reports/View",
  },
  view: {
    displayName: "Generate Reports for Export",
    key: "Reports/View",
  },
};

const SECURITIES_SERVICES_OPS = {
  view: {
    displayName: "View Securities Services",
    key: "Services/Security/View",
  },
  manage: {
    displayName: "Manage Securities Services",
    key: "Services/Security/Manage",
  },
};

const SECURITIES_SERVICES_INVESTOR = {
  view: {
    displayName: "View Investor Services",
    key: "Services/Investor/View",
  },
  manage: {
    displayName: "Manage Securities Services",
    key: "Services/Investor/Manage",
  },
};

const SECURITIES_SERVICES_ISSUER = {
  view: {
    displayName: "View Issuer Services",
    key: "Services/Issuer/View",
  },
  manage: {
    displayName: "Manage Issuer Services",
    key: "Services/Issuer/Manage",
  },
};

const SECURITIES_CUSTODY_AND_CLEARING = {
  view: {
    displayName: "View Custody & Clearing",
    key: "Services/CustodyClearing/View",
  },
};

const ACL_MANAGEMENT = {
  edit: {
    displayName: "Edit Access Control List",
    key: "ACLManagement/Edit",
  },
};
const SECURITIES_ADMIN = {
  view: {
    displayName: "View Custody & Clearing",
    key: "Services/CustodyClearing/View",
  },
  manage: {
    displayName: "Manage Securities Services",
    key: "Services/Security/Manage",
  },
};

const SETTLEMENT_ADMIN = {
  view: {
    displayName: "View Custody & Clearing",
    key: "Services/CustodyClearing/View",
  },
  manage: {
    displayName: "Manage Securities Services",
    key: "Services/Security/Manage",
  },
};

const ENTITIES_LISTING = {
  view: {
    displayName: "Entity Listing",
    key: "EntityListing/View",
  },
};

const RELATIONSHIP = {
  manage: {
    displayName: "Manage Relationship",
    key: "Relationship/Manage",
  },
  view: {
    displayName: "View Relationship",
    key: "Relationship/View",
  },
};

export default {
  ADMISSION,
  ENGAGEMENT,
  GROUP_MANAGEMENT,
  ISSUANCE,
  KYC,
  SIGNING,
  SUBSCRIPTION,
  TERMSHEET,
  PARTICIPATION,
  SUPPORT_TICKET_MANAGEMENT,
  ACCOUNT,
  PAYMENT,
  QUOTES,
  REPORTS,
  SECURITIES_SERVICES_OPS,
  SECURITIES_SERVICES_INVESTOR,
  SECURITIES_SERVICES_ISSUER,
  SECURITIES_CUSTODY_AND_CLEARING,
  ACL_MANAGEMENT,
  SECURITIES_ADMIN,
  SETTLEMENT_ADMIN,
  ENTITIES_LISTING,
  RELATIONSHIP,
};
