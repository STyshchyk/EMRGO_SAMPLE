import * as Yup from "yup";

const issuanceTermsheetSchema = Yup.object().shape({
  sukukType: Yup.string().nullable(),
  entityId: Yup.string().nullable(),
  version: Yup.string().nullable(),
  distributionMethod: Yup.string().nullable(),
  currency: Yup.string().nullable(),
  issuanceAmount: Yup.string().nullable(),
  denomination: Yup.string().nullable(),
  numberOfCertificates: Yup.number().integer("Certificate Count must be integer").nullable(),
  issuePrice: Yup.string().nullable(),
  tradeDate: Yup.date().nullable(),
  issueDate: Yup.date().nullable(),
  maturityDate: Yup.date().nullable(),
  underlyingAssets: Yup.string().nullable(),
  maturityAmount: Yup.string().nullable(),
  profitRateTerms: Yup.string().nullable(),
  profitRate: Yup.string().nullable(),
  frequency: Yup.string().nullable(),
  dayCountConvention: Yup.string().nullable(),
  sellingRestrictions: Yup.string().nullable(),
  formOfOffering: Yup.string().nullable(),
  useOfProceeds: Yup.string().nullable(),
  shariahCompliance: Yup.string().nullable(),
  ranking: Yup.string().nullable(),
  listing: Yup.string().nullable(),
  rating: Yup.string().nullable(),
  governingLaw: Yup.string().nullable(),
  jurisdiction: Yup.string().nullable(),
  guarantor: Yup.string().nullable(),
});

export default issuanceTermsheetSchema;
