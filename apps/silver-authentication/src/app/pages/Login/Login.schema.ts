import * as Yup from "yup";

export const loginSchema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
  code: Yup.string().required().min(6, "Enter a code"),
});
