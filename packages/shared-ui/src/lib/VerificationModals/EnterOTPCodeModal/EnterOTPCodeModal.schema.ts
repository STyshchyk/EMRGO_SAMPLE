import * as Yup from "yup";

export const EnterOTPCodeFormSchema = Yup.object().shape({
  otp: Yup.string().max(6).min(6).required("Required"),
});
