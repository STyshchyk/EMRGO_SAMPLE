import * as Yup from "yup";

export const LoginSchema = Yup.object().shape({
  email: Yup.string().email().required("Required"),
  password: Yup.string().required("Required"),
});

export const LoginCode = Yup.object().shape({
  code: Yup.string().length(6, "String lenght 6")
});

