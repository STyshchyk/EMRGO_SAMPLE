import * as Yup from "yup";

const inviteUserFormSchema = Yup.object().shape({
  email: Yup.string().email().required("Corporate Email is required"),
});

export default inviteUserFormSchema;
