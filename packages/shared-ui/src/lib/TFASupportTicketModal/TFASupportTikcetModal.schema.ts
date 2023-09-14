import * as Yup from "yup";

export const TFASupportTicketModalFormSchema = Yup.object().shape({
  email: Yup.string().email("Enter valid email").required("Email ID is Required"),
  file: Yup.object().shape({
    name: Yup.string().required(),
    path: Yup.string().required(),
  }),
});
