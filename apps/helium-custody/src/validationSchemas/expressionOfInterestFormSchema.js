import * as Yup from "yup";

const expressionOfInterestFormSchema = Yup.object().shape({
  authorisedPersonFirstname: Yup.string().required("First name is required").nullable(),
  authorisedPersonMiddlename: Yup.string().nullable(),
  authorisedPersonLastname: Yup.string().required("Last name is required").nullable(),
  authorisedPersonIDFileName: Yup.string().nullable(),
  authorisedPersonEmail: Yup.string()
    .email("Email address must be valid")
    .required("Email address is required")
    .nullable(),
  authorisedPersonAddressLine1: Yup.string().nullable(),
  authorisedPersonDisplayRole: Yup.string().required("Corporate Title is required").nullable(),
  authorisedPersonCity: Yup.string().nullable(),
  authorisedPersonCountry: Yup.string().nullable(),
  authorisedPersonPincode: Yup.string().min(5).nullable(),
  authorisedPersonUtilityFileName: Yup.string().nullable(),
  POAFileName: Yup.string().nullable(),
  boardResolutionFileName: Yup.string().nullable(),
  clientClassificationFileName: Yup.string().nullable(),
  directors: Yup.array().of(
    Yup.object().shape({
      name: Yup.string(),
      id: Yup.string(),
    })
  ),
});

export default expressionOfInterestFormSchema;
