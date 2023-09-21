import * as Yup from "yup";

const UKLabel = 'United Kingdom of Great Britain and Northern Ireland';
const USALabel = 'United States of America';

// Define a helper function
const createConditionalSchema = (condition, errorMessage) =>
  Yup.string().when(condition, {
    is: true,
    then: () => Yup.string().nullable().required(errorMessage),
    otherwise:() => Yup.string().nullable(),
  });

  const createCountryLabelSchema = (name,requiredLabels, errorMessage) =>
  Yup.string().when(name, {
    is: (label) => requiredLabels.includes(label),
    then: () => Yup.string().nullable().required(errorMessage),
    otherwise: () => Yup.string().nullable(),
});


const addPaymentAccountFormSchema = Yup.object().shape({
  sourceEntity: Yup.object().nullable().required("Entity is required"),
  address: Yup.string().required("Address is required"),
  bankName: Yup.string().required("Bank Name is required"),
  city: Yup.string().required("City is required"),
  country: Yup.object().shape({
    label: Yup.string(),
    value: Yup.string(),
  }).nullable().required("Country is required"),
  currency: Yup.object().nullable().required("Currency is required"),
  iban: Yup.string().required("IBAN is required"),
  label: Yup.string().required("Label is required"),
  name: Yup.string().required("Name is required"),
  postcode: Yup.string().required("Post code is required"),
  swift: Yup.string().required("SWIFT is required"),
  accountNo: createCountryLabelSchema("country.label",[USALabel, UKLabel], "Account number is required"),
  routingNo: createCountryLabelSchema("country.label",[USALabel], "Routing number is required"),
  sortCode: createCountryLabelSchema("country.label",[UKLabel], "Sort code is required"),
  hasIntermediaryBank: Yup.boolean().default(false),
  intermediaryBankIBAN: createConditionalSchema(
    "hasIntermediaryBank",
    "IBAN is required"
  ),
  intermediaryBankBIC: createConditionalSchema(
    "hasIntermediaryBank",
    "BIC is required"
  ),
  intermediaryBankName: createConditionalSchema(
    "hasIntermediaryBank",
    "Bank Name is required"
  ),
  intermediaryBankAddress: createConditionalSchema(
    "hasIntermediaryBank",
    "Address is required"
  ),
  intermediaryBankCity: createConditionalSchema(
    "hasIntermediaryBank",
    "City is required"
  ),
  intermediaryBankPostCode: createConditionalSchema(
    "hasIntermediaryBank",
    "Post Code is required"
  ),
  intermediaryBankCountry: Yup.string().when("hasIntermediaryBank", {
    is:  true,
    then: () => Yup.object().nullable().required("Country is required"),
    otherwise: () => Yup.string().nullable(), 
  }),
  intermediaryBankAccountNo: createCountryLabelSchema("intermediaryBankCountry.label",[USALabel, UKLabel], "Account number is required"),
  intermediaryBankRouteCode: createCountryLabelSchema("intermediaryBankCountry.label",[USALabel], "Routing number is required"),
  intermediaryBankSortCode: createCountryLabelSchema("intermediaryBankCountry.label",[UKLabel], "Sort code is required"),
});

export default addPaymentAccountFormSchema;
