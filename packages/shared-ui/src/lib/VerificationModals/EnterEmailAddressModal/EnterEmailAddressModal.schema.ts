import * as Yup from "yup";


export const EnterEmailAddressModalSchema = Yup.object().shape({
  email: Yup.string().email().required("Required"),
  code: Yup.string().required("Required").length(6),
});
