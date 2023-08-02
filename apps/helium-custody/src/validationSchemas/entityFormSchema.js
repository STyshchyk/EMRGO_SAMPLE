import * as Yup from "yup";

const entityFormSchema = Yup.object().shape({
  entity_name: Yup.string().required("Entity name is required"),
  entity_type: Yup.string().required("Entity type is required"),
  first_name: Yup.string().required("First name is required"),
  middle_name: Yup.string(),
  last_name: Yup.string(),
  email: Yup.string().email().required("Email is required"),
  designation: Yup.string(),
});

export default entityFormSchema;
