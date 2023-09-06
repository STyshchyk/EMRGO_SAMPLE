import * as Yup from "yup";

export const CreatePasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(10, "Password must contain 10 or more characters")
    .max(128, "Password can have upto 128 characters")
    .matches(/^(?=.*[0-9])/, "Password must contain at least one number")
    .matches(/^(?=.*[!#$%&*?@])/, "Password must contain at least one special character")
    .required("Required"),
  confirmPassword: Yup.string()
    .required("Please retype your password.")
    .oneOf([Yup.ref("password")], "Your passwords do not match."),
});
