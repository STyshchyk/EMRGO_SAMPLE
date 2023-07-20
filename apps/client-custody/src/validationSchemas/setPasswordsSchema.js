import * as Yup from "yup";

// !Dev note: This regexp pattern matches password strings of length greater than or equal to 10 containing at least one of the following: uppercase letters, lowercase letters, numbers and symbols

const REGEXP_PASSWORD = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!#$%&*?@])[\d!#$%&*?@A-Za-z]{10,}$/;

const message =
  "Password must be minimum 10 characters and must include a lowercase letter, number and a special character";

const setPasswordsSchema = Yup.object().shape({
  password: Yup.string()
    .min(10, message)
    .max(128, message)
    .required(message)
    .matches(REGEXP_PASSWORD, message),
  confirmPassword: Yup.mixed()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is Required"),
});

export default setPasswordsSchema;
