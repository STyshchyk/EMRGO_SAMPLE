import { IIssuance } from "@emrgo-frontend/types";

const mockedIssuance: IIssuance = {
  id: "fef0657c-7d63-4e5c-bc17-5c82e6164a68",
  name: "issue 1",
  sellSideOrganisation: "fef0657c-7d63-4e5c-bc17-5c82e6164a68",
  isin: "232",
  statusId: "768ca4f9-2a37-4ce2-bce8-e2375b2eefd8",
  productType: "2222",
  productDetails: "22222",
  csd: "",
  custody: "",
  issuerId: "6eee8afb-5a31-4571-95af-4d56ea5c9745",
  typeId: "c28dcb9a-0308-4d1d-af13-91d60c30eab3",
  currencyId: "436e5a37-8655-432c-88b9-7c78028d68a4",
  amount: 3333,
  return: 3,
  tenor: 3,
  wethaqId: null,
  preOfferPeriodEnd: "2023-05-31T00:00:00Z",
  offerPeriodEnd: "2023-05-31T00:00:00Z",
  issueDate: "2023-05-31T00:00:00Z",
  redemptionDate: "2023-05-31T00:00:00Z",
  timeLeft: "0001-01-01T00:00:00Z",
  sellSide: {
    id: "fef0657c-7d63-4e5c-bc17-5c82e6164a68",
    name: "Emrgo",
    logo: "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",
  },
  isWatched: false,
  currency: {
    id: "436e5a37-8655-432c-88b9-7c78028d68a4",
    name: "AED",
    nameAr: "AED",
  },
  status: {
    id: "768ca4f9-2a37-4ce2-bce8-e2375b2eefd8",
    name: "Pending Linked Instruction",
    nameAr: "Pending Linked Instruction",
  },
  type: {
    id: "c28dcb9a-0308-4d1d-af13-91d60c30eab3",
    name: "Sukuk Al Ijarah",
    nameAr: "صكوك الإجارة",
  },
  issuer: {
    id: "6eee8afb-5a31-4571-95af-4d56ea5c9745",
    name: "issuer 1",
    isShown: true,
  },
  documents: [
    {
      id: "49e4ae26-c14d-4b08-9cb4-c705c8f53252",
      name: "assdsdsds",
      opportunityId: "fef0657c-7d63-4e5c-bc17-5c82e6164a68",
      objectName: "opportunity_doc_fef0657c-7d63-4e5c-bc17-5c82e6164a68_assdsdsds",
    },
    {
      id: "04e5c913-bdc5-4c16-8846-3ded408e8271",
      name: "tizer",
      opportunityId: "fef0657c-7d63-4e5c-bc17-5c82e6164a68",
      objectName: "opportunity_doc_fef0657c-7d63-4e5c-bc17-5c82e6164a68_tizer",
    },
  ],
};

export default mockedIssuance;
