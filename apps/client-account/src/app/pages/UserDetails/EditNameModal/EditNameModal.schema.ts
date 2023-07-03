import * as Yup from "yup";

export const EditNameModalSchema = Yup.object().shape({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
});
