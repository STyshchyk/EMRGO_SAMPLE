import * as Yup from "yup";

const platformEditUserFormSchema = Yup.object().shape({
  email: Yup.string().email(),
  password: Yup.string(),
  displayRole: Yup.string(),
});

export default platformEditUserFormSchema;
