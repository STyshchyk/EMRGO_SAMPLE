import * as Yup from "yup";

const inviteUserSchema = Yup.object().shape({
  authorisedPersonFirstName: Yup.string().required("First name is required"),
  authorisedPersonMiddleName: Yup.string(),
  authorisedPersonLastName: Yup.string(),
  entityType: Yup.string().required("Entity type is required"),
  authorisedPersonEmail: Yup.string().required("Email is required"),
  authorisedPersonDisplayRole: Yup.string().required("Display role is required"),
  entityName: Yup.string().required("Entity name is required"),
});

export default inviteUserSchema;
