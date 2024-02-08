import * as Yup from "yup";

export const PostMessageSchema = Yup.object().shape({
  subject: Yup.string().required("Required"),
  label: Yup.object().required("Required"),
  message: Yup.string().required().min(1).max(300),
});
