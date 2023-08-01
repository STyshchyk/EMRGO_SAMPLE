import * as Yup from "yup";

const kycRequirementsSchema = Yup.object().shape({
  companyRegisterExtractFileName: Yup.string().nullable(),
  certificateOfIncorporationFileName: Yup.string().nullable(),
  articlesOfAssociationFileName: Yup.string().nullable(),
  ownershipStructureChartFileName: Yup.string().nullable(),
  legalEntityIdentifier: Yup.string().nullable(),
  directors: Yup.array().of(
    Yup.object().shape({
      firstName: Yup.string().nullable(),
      lastName: Yup.string().nullable(),
      passportCopyFileName: Yup.string().nullable(),
      addressLine1: Yup.string().nullable(),
      addressLine2: Yup.string().nullable(),
      city: Yup.string().nullable(),
      countryId: Yup.string().nullable(),
      pinCode: Yup.string().nullable(),
      id: Yup.string().nullable(),
    })
  ),
  ultimateBeneficiaryOwners: Yup.array().of(
    Yup.object().shape({
      firstName: Yup.string().nullable(),
      lastName: Yup.string().nullable(),
      passportCopyFileName: Yup.string().nullable(),
      countryOfResidence: Yup.string().nullable(),
      isPoilticallyExposed: Yup.boolean().nullable(),
      politicalExposure: Yup.string().nullable(),
      id: Yup.string().nullable(),
    })
  ),
  authorisedSignatories: Yup.array().of(
    Yup.object().shape({
      firstName: Yup.string().nullable(),
      lastName: Yup.string().nullable(),
      email: Yup.string().nullable(),
      id: Yup.string().nullable(),
    })
  ),
  taxIdentificationNumber: Yup.string().nullable(),
  taxResidenceFileName: Yup.string().nullable(),
  primaryOperations: Yup.string().nullable(),
  POAFileName: Yup.string().nullable(),
  mainSubsidiariesBusiness: Yup.string().nullable(),
  hasBearerShares: Yup.boolean().nullable(),
  bearerShareDetails: Yup.string().nullable(),

  operatingAddress: Yup.object().shape({
    addressLine1: Yup.string().nullable(),
    addressLine2: Yup.string().nullable(),
    city: Yup.string().nullable(),
    id: Yup.string().nullable(),
    country: Yup.string().nullable(),
    pinCode: Yup.string().nullable(),
    operatingAddressUtilityFileName: Yup.string().nullable(),
  }),
  domicileAddress: Yup.object().shape({
    addressLine1: Yup.string().nullable(),
    addressLine2: Yup.string().nullable(),
    city: Yup.string().nullable(),
    id: Yup.string().nullable(),
    country: Yup.string().nullable(),
    pinCode: Yup.string().nullable(),
    domicileAddressUtilityFileName: Yup.string().nullable(),
  }),
  mailingAddress: Yup.object().shape({
    addressLine1: Yup.string().nullable(),
    addressLine2: Yup.string().nullable(),
    city: Yup.string().nullable(),
    id: Yup.string().nullable(),
    country: Yup.string().nullable(),
    pinCode: Yup.string().nullable(),
    mailingAddressUtilityFileName: Yup.string().nullable(),
  }),
  authorisedPersonAddressLine1: Yup.string().required("Address is Required"),
  authorisedPersonAddressLine2: Yup.string().nullable(),
  authorisedPersonCity: Yup.string().required("City is Required"),
  authorisedPersonPincode: Yup.string().required("Post Code is Required"),
  authorisedPersonCountry: Yup.string().required("Country is Required"),
  authorisedPersonUtilityFileName: Yup.string().required("Utility File is Required"),
});

export default kycRequirementsSchema;
