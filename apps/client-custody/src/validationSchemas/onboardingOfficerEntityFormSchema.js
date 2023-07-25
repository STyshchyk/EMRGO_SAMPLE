import * as Yup from "yup";

const onboardingOfficerEntityFormSchema = Yup.object().shape({
  directors: Yup.array().of(
    Yup.object().shape({
      addressLine1: Yup.string().nullable(),
      addressLine2: Yup.string().nullable(),
      city: Yup.string().nullable(),
      country: Yup.string().nullable(),
      pinCode: Yup.string().min(5).nullable(),
      politicalExposure: Yup.string().nullable(),
    })
  ),
});

export default onboardingOfficerEntityFormSchema;
