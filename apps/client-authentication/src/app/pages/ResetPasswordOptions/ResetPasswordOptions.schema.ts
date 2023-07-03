import * as Yup from "yup";

export const ResetPasswordOptionsSchema = Yup.object().shape({
  email: Yup.string().email().required("Required"),
  options: Yup.string().required("Required"),
});
