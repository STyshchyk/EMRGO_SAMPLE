import * as Yup from "yup";

export const onboardUserSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(5, "First Name is Too Short!")
    .max(50, "First Name is Too Long!")
    .required("First Name is Required"),
  lastName: Yup.string()
    .min(2, "Second Name is Too Short!")
    .max(50, "Second Name is Too Long!")
    .required("Second Name is Required"),
  email: Yup.string().email("Enter valid email").required("Email ID is Required"),
  role: Yup.object().required("Select role")
});
