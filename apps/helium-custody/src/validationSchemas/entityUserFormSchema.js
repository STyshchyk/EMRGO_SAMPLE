import * as Yup from "yup";

const entityUserFormSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  middleName: Yup.string(),
  lastName: Yup.string(),
  email: Yup.string().email().required("Email is required"),
  displayRole: Yup.string(),
  moduleIds: Yup.array(),
  entityId: Yup.string().required("Entity ID is required"),
});

export default entityUserFormSchema;
