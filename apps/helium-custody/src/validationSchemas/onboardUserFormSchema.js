import * as Yup from "yup";

const onboardUserSchema = Yup.object().shape({
  email: Yup.string().email("Email address must be valid").required("Email address is required"),
  firstName: Yup.string().required("First name is required"),
  middleName: Yup.string(),
  lastName: Yup.string().required("Last Name is required"),
});

export default onboardUserSchema;
