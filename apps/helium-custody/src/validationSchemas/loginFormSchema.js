import * as Yup from "yup";

const loginFormSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().min(10).max(128).required(),
});

export default loginFormSchema;
