import * as Yup from "yup";

const entityAdminKYCFormSchema = Yup.object().shape({
  authorisedSignatory: Yup.object().shape({
    name: Yup.string().nullable(),
    email: Yup.string().email("Please provide a valid email address").nullable(),
  }),
});

export default entityAdminKYCFormSchema;
