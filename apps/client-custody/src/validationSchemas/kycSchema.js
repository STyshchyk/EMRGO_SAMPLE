import * as Yup from "yup";

const identificationDetailsSchema = Yup.object().shape({
  entityName: Yup.string().nullable().required("Registered Name is required"),
  legalForm: Yup.string().required("Legal Form is required"),
  incorporationDate: Yup.string().nullable().required("Date of Incorporation is required"),
  incorporationPlace: Yup.string().nullable().required("Place of Incorporation is required"),
  legalEntityIdentifier: Yup.string()
    .min(20, "Must be exactly 20 characters")
    .max(20, "Must be exactly 20 characters"),
  // tradingNames: Yup.array().of(Yup.string()).required('Required'),
  registeredAddress: Yup.object().shape({
    addressLine1: Yup.string().nullable().required("Address Line 1 is required"),
    city: Yup.string().nullable().required("City is required"),
    country: Yup.string().nullable().required("Country is required"),
    pinCode: Yup.string().nullable().required("Post code is required"),
    businessPhone: Yup.string().nullable().required("Telephone is required"),
  }),
  partOfGroup: Yup.string().nullable().required("Entity part of group is required"),
  businessActivityIndustry: Yup.string()
    .nullable()
    .required("Industry of Business Activity is required"),
  businessActivitySector: Yup.string()
    .nullable()
    .required("Sector of Business Activity is required"),
  supervisedByFinancialServicesRegulatory: Yup.string()
    .nullable()
    .required("Entity supervision is required"),
});

const identificationDetailsIssuerSchema = Yup.object().shape({
  entityName: Yup.string().nullable().required("Registered Name is required"),
  legalForm: Yup.string().required("Legal Form is required"),
  incorporationDate: Yup.string().nullable().required("Date of Incorporation is required"),
  incorporationPlace: Yup.string().nullable().required("Place of Incorporation is required"),
  registeredAddress: Yup.object().shape({
    addressLine1: Yup.string().nullable().required("Address Line 1 is required"),
    city: Yup.string().nullable().required("City is required"),
    country: Yup.string().nullable().required("Country is required"),
    pinCode: Yup.string().nullable().required("Post code is required"),
    businessPhone: Yup.string().nullable().required("Telephone is required"),
  }),
  legalEntityIdentifier: Yup.string().min(20, "Must be exactly 20 characters").ma,
});

const shareholdersSchema = Yup.object().shape({
  declarationOfAuthorisation: Yup.boolean(),
  acceptedTnc: Yup.boolean(),
});

const shareholdingIndividualSchemaKSA = Yup.object().shape({
  shareHoldingPercentage: Yup.number()
    .required("Shareholding Percentage is required")
    .max(100, "Shareholding Percentage cannot be greater than 100%")
    .min(1, "Shareholding Percentage cannot be less than 1%"),
  firstName: Yup.string().nullable().required("First Name is required"),
  lastName: Yup.string().nullable().required("Last Name is required"),
  politicallyExposed: Yup.string().nullable().required("Politically Exposed indicator is required"),
  addressLine1: Yup.string().nullable().required("Address Line 1 is required"),
  city: Yup.string().nullable().required("City is required"),
  country: Yup.string().nullable().required("Country is required"),
  pinCode: Yup.string().nullable().required("Post Code is required"),
  businessPhone: Yup.string().nullable().required("Telephone number is required"),
  saudiIdNumber: Yup.string().nullable().required("Saudi Id Number is required"),
  saudiIdExpiry: Yup.string().nullable().required("Saudi Id Expiry Date is required"),
  passportNumber: Yup.string().nullable().required("Passport Number is required"),
  passportExpiry: Yup.string().nullable().required("Passport Exiry Date is required"),
  passportCopyFileName: Yup.string().nullable().required("Passport Copy is required"),
  addressProofFileName: Yup.string().nullable().required("Address Proof is required"),
  saudiIdFileName: Yup.string().nullable().required("Id Copy is required"),
  shareholderProofFileName: Yup.string().nullable().required("Shareholder Proof is required"),
});

const shareholdingIndividualSchema = Yup.object().shape({
  shareHoldingPercentage: Yup.number()
    .required("Shareholding Percentage is required")
    .max(100, "Shareholding Percentage cannot be greater than 100%")
    .min(1, "Shareholding Percentage cannot be less than 1%"),
  firstName: Yup.string().nullable().required("First Name is required"),
  lastName: Yup.string().nullable().required("Last Name is required"),
  politicallyExposed: Yup.string().nullable().required("Politically Exposed indicator is required"),
  addressLine1: Yup.string().nullable().required("Address Line 1 is required"),
  city: Yup.string().nullable().required("City is required"),
  country: Yup.string().nullable().required("Country is required"),
  pinCode: Yup.string().nullable().required("Post Code is required"),
  businessPhone: Yup.string().nullable().required("Telephone number is required"),
  passportNumber: Yup.string().nullable().required("Passport Number is required"),
  passportExpiry: Yup.string().nullable().required("Passport Exiry Date is required"),
  passportCopyFileName: Yup.string().nullable().required("Passport Copy is required"),
  addressProofFileName: Yup.string().nullable().required("Address Proof is required"),
});

const shareholdingEntitySchema = Yup.object().shape({
  shareHoldingPercentage: Yup.number()
    .required("Shareholding Percentage is required")
    .max(100, "Shareholding Percentage cannot be greater than 100%")
    .min(1, "Shareholding Percentage cannot be less than 1%"),
  name: Yup.string().nullable().required("Registered Name is required"),
  incorporationDate: Yup.string().nullable().required("Incorporation Date is required"),
  incorporationPlace: Yup.string().nullable().required("Incorporation Place is required"),
  legalEntityIdentifier: Yup.string().nullable().required("Legal Entity Identifier is required"),
  commercialRegNo: Yup.string().nullable().required("Commercial Registration Number is required"),
  addressLine1: Yup.string().nullable().required("Address Line 1 is required"),
  city: Yup.string().nullable().required("City is required"),
  country: Yup.string().nullable().required("Country is required"),
  pinCode: Yup.string().nullable().required("Post Code is required"),
  businessPhone: Yup.string().nullable().required("Telephone number is required"),
});

const keyIndividualSchema = Yup.object().shape({
  capacity: Yup.string().nullable().required("Capacity is required"),
  firstName: Yup.string().nullable().required("First Name is required"),
  lastName: Yup.string().nullable().required("Last Name is required"),
  politicallyExposed: Yup.string().nullable().required("Politically Exposed indicator is required"),
  addressLine1: Yup.string().nullable().required("Address Line 1 is required"),
  city: Yup.string().nullable().required("City is required"),
  country: Yup.string().nullable().required("Country is required"),
  pinCode: Yup.string().nullable().required("Post Code is required"),
  businessPhone: Yup.string().nullable().required("Telephone number is required"),
  passportNumber: Yup.string().nullable().required("Passport Number is required"),
  passportExpiry: Yup.string().nullable().required("Passport Exiry Date is required"),
  passportCopyFileName: Yup.string().nullable().required("Passport Copy is required"),
  addressProofFileName: Yup.string().nullable().required("Address Proof is required"),
});

const keyIndividualSchemaKSA = Yup.object().shape({
  capacity: Yup.string().nullable().required("Capacity is required"),
  firstName: Yup.string().nullable().required("First Name is required"),
  lastName: Yup.string().nullable().required("Last Name is required"),
  politicallyExposed: Yup.string().nullable().required("Politically Exposed indicator is required"),
  addressLine1: Yup.string().nullable().required("Address Line 1 is required"),
  city: Yup.string().nullable().required("City is required"),
  country: Yup.string().nullable().required("Country is required"),
  pinCode: Yup.string().nullable().required("Post Code is required"),
  businessPhone: Yup.string().nullable().required("Telephone number is required"),
  saudiIdNumber: Yup.string().nullable().required("Saudi Id Number is required"),
  saudiIdExpiry: Yup.string().nullable().required("Saudi Id Expiry Date is required"),
  passportNumber: Yup.string().nullable().required("Passport Number is required"),
  passportExpiry: Yup.string().nullable().required("Passport Expiry Date is required"),
  passportCopyFileName: Yup.string().nullable().required("Passport Copy is required"),
  addressProofFileName: Yup.string().nullable().required("Address Proof is required"),
  chamberOfCommerceAuthorizationFileName: Yup.string()
    .nullable()
    .required("Chamber of Commerce Authorization is required"),
});

const entityWealthSchema = Yup.object().shape({
  netAssetsOfEntityId: Yup.string()
    .nullable()
    .required("Estimated global net assets of the Entity is required"),
  annualTurnoverId: Yup.string().nullable().required("Annual turnover is required"),
  levelOwnFundsId: Yup.string()
    .nullable()
    .required('Level of "own funds": share capital, investments, cash is required'),
  sourceOfFundsId: Yup.string().required("How has this been built up? is required"),
  // personalInvestmentVehicle: Yup.string().nullable().required('Is the Entity a Personal Investment Vehicle is required'),
  vehicleCapitalSourceId: Yup.string()
    .nullable()
    .required("Source of the Vehicle's capital is required"),
});

const experienceSchema = Yup.object().shape({
  investedProductsId: Yup.string()
    .nullable()
    .required("Products previously invested indicator in is required"),
  investedProductsOther: Yup.string().nullable(),
  everBoughtPrivatelyPlacedSecurities: Yup.string()
    .nullable()
    .required("Owned or sold privately places securities indicator is required"),
  debtInstrumentsLevelId: Yup.string()
    .nullable()
    .required("Debt Instruments understanding indicator is required"),
  howLongActiveId: Yup.string().nullable().required("Investing time period indicator is required"),
  consultFinancialAdvisor: Yup.string()
    .nullable()
    .required("Financial consultant advisor indicator is required"),
  howOftenInPrivateSecuritiesId: Yup.string()
    .nullable()
    .required("Private placed security investment count indicator is required"),
  cashOutPeriodId: Yup.string().nullable().required("Cash out period indicator is required"),
});

const individualSchemaAr = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  firstName_ar: Yup.string().required("First Name (Arabic) is required"),
  middleName: Yup.string().nullable(),
  middleName_ar: Yup.string().nullable(),
  lastName: Yup.string().required("Last Name is required"),
  lastName_ar: Yup.string().required("Last Name (Arabic) is required"),
  gender: Yup.string().required("Gender is required"),
  gender_ar: Yup.string().required("Gender (Arabic) is required"),
  dob: Yup.string().required("Date of Birth is required"),
  dob_ar: Yup.string().required("Date of Birth (Arabic) is required"),
  idNumber: Yup.string().required("ID Number is required"),
  idNumber_ar: Yup.string().required("ID Number (Arabic) is required"),
  mobileNumber: Yup.string().required("Mobile number is required"),
  nationality: Yup.string().required("Nationality is required"),
  passportNumber: Yup.string().required("Passport Number is required"),
  passportExpiry: Yup.string().required("Passport expiry is required"),
  designation: Yup.string().required("Designation is required"),
  corporateEmail: Yup.string().required("Corporate Email is required"),
});

const individualSchema = Yup.object().shape({
  capacity: Yup.string().required("Capacity is required"),
  firstName: Yup.string().required("First Name is required"),
  middleName: Yup.string().nullable(),
  lastName: Yup.string().required("Last Name is required"),
  mobileNumber: Yup.string().required("Mobile number is required"),
  designation: Yup.string().required("Designation is required"),
  corporateEmail: Yup.string().required("Corporate Email is required"),
});

const paymentAccountSchema = Yup.object().shape({
  currency: Yup.string().nullable().required("Currency is required"),
  name: Yup.string().required("Full Name is required"),
  bankName: Yup.string().required("Bank Name is required"),
  iban: Yup.string().required("IBAN is required"),
  swift: Yup.string().required("Swift number is required"),
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  country: Yup.string().nullable().required("Country is required"),
  postcode: Yup.string().required("City is required"),
});

export default {
  individualSchema,
  individualSchemaAr,
  experienceSchema,
  entityWealthSchema,
  identificationDetailsSchema,
  identificationDetailsIssuerSchema,
  shareholdersSchema,
  shareholdingIndividualSchema,
  shareholdingIndividualSchemaKSA,
  shareholdingEntitySchema,
  keyIndividualSchema,
  keyIndividualSchemaKSA,
  paymentAccountSchema,
};
