import * as Yup from "yup";

const platformUserFormSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  middleName: Yup.string(),
  lastName: Yup.string(),
  email: Yup.string().email().required("Email is required"),
  role: Yup.string().required("Role is Required"),
  displayRole: Yup.string().required("Display Role is Required"),
  modules: Yup.array().required("Please select atleast 1 Module"),
  entityId: Yup.string().required("Entity ID is required"),
});

export default platformUserFormSchema;
