import * as Yup from "yup";

export const onboardUserSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(4, "First Name should contain more than 4 symbols")
    .max(50, "First Name is Too Long!")
    .required("First Name is Required"),
  lastName: Yup.string()
    .min(4, "Last Name should contain more than 4 symbols")
    .max(50, "Last Name is Too Long!")
    .required("Last Name is Required"),
  email: Yup.string().email("Enter valid email").required("Email ID is Required"),
  roles: Yup.array().required("Select role"),
});
