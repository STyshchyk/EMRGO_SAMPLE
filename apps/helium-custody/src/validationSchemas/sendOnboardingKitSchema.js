import * as Yup from "yup";

const sendOnboardingKitSchema = Yup.object().shape({
  contactName: Yup.string().required("Contact name is required"),
  entityType: Yup.string().required("Entity type is required"),
  entityName: Yup.string().required("Entity name is required"),
  contactEmail: Yup.string().email().required("Email is required"),
});

export default sendOnboardingKitSchema;
