import * as Yup from "yup";

export const EnterEmailAddressModalSchema = Yup.object().shape({
  email: Yup.string().email().required("Required"),
});
