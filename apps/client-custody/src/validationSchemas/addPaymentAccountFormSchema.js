import * as Yup from "yup";

const UKLabel = 'United Kingdom of Great Britain and Northern Ireland';
const USALabel = 'United States of America';

// Define a helper function
const createConditionalSchema = (condition, field) =>
  Yup.string().when(condition, {
    is:true,
    then: () => Yup.string().nullable().max(50, `${field} is too long`).required(`${field} is required`),
    otherwise:() => Yup.string().nullable(),
});

const createCountryLabelSchema = (condition,requiredLabels, field) =>
  Yup.string().when(condition, {
    is: (label) => requiredLabels.includes(label),
    then: () => Yup.string().nullable().max(50, `${field} is too long`).required(`${field} is required`),
    otherwise: () => Yup.string().nullable(),
});


const addPaymentAccountFormSchema = Yup.object().shape({
  address: Yup.string().max(255,'Address is too long').required("Address is required"),
  bankName: Yup.string().max(50,'Bank Name is too long').required("Bank Name is required"),
  city: Yup.string().max(50,'City is too long').required("City is required"),
  country: Yup.object().shape({
    label: Yup.string(),
    value: Yup.string(),
  }).nullable().required("Country is required"),
  currency: Yup.object().nullable().required("Currency is required"),
  iban: Yup.string().max(50,'IBAN is too long').required("IBAN is required"),
  label: Yup.string().max(50,'Label is too long').required("Label is required"),
  name: Yup.string().max(50,'Name is too long').required("Name is required"),
  postcode: Yup.string().max(50,'PostCode is too long').required("Post code is required"),
  swift: Yup.string().max(20,'Swift is too long').required("SWIFT is required"),
  accountNo: createCountryLabelSchema("country.label",[USALabel, UKLabel], "Account number is required"),
  routingNo: createCountryLabelSchema("country.label",[USALabel], "Routing number is required"),
  sortCode: createCountryLabelSchema("country.label",[UKLabel], "Sort code is required"),
  hasIntermediaryBank: Yup.boolean().default(false),
  intermediaryBankIBAN: createConditionalSchema(
    "hasIntermediaryBank",
    "IBAN"
  ),
  intermediaryBankBIC: createConditionalSchema(
    "hasIntermediaryBank",
    "BIC"
  ),
  intermediaryBankName: createConditionalSchema(
    "hasIntermediaryBank",
    "Bank Name"
  ),
  intermediaryBankAddress: createConditionalSchema(
    "hasIntermediaryBank",
    "Address"
  ),
  intermediaryBankCity: createConditionalSchema(
    "hasIntermediaryBank",
    "City"
  ),
  intermediaryBankPostCode: createConditionalSchema(
    "hasIntermediaryBank",
    "Post Code"
  ),
  intermediaryBankCountry: Yup.string().when("hasIntermediaryBank", {
    is:true,
    then: () => Yup.object().nullable().required("Country is required"),
    otherwise: () => Yup.object().nullable(), 
  }),
  intermediaryBankAccountNo: createCountryLabelSchema("intermediaryBankCountry.label",[USALabel, UKLabel], "Account number"),
  intermediaryBankRouteCode: createCountryLabelSchema("intermediaryBankCountry.label",[USALabel], "Routing number"),
  intermediaryBankSortCode: createCountryLabelSchema("intermediaryBankCountry.label",[UKLabel], "Sort code"),
});

export default addPaymentAccountFormSchema;
