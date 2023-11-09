import * as Yup from "yup";

export const EnterOTPCodeFormSchema = Yup.object().shape({
  code: Yup.string().max(6).min(6).required("Required"),
});
