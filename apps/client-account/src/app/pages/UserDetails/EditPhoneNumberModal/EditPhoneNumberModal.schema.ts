import * as Yup from "yup";

export const EditPhoneNumberModalSchema = Yup.object().shape({
  phone: Yup.string()
    .required()
    .matches(/^\+?[0-9]+$/, "Must be only digits") // plus sign is optional
    .min(7, "Phone number must have more than 7 digits")
    .max(14, "Phone number must have less than 14 digits")
    .required("Phone number is required"),
});
