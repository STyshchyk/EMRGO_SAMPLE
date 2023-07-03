import * as Yup from "yup";

export const ResetPasswordSixDigitCodeSchema = Yup.object().shape({
  email: Yup.string().email().required("Required"),
  code: Yup.string()
    .min(6, "Must be exactly 6 digits")
    .max(6, "Must be exactly 6 digits")
    .required("Required"),
  verificationType: Yup.string().required("Required"),
});
