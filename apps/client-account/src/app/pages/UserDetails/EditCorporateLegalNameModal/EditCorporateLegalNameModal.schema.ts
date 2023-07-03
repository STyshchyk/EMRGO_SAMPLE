import * as Yup from "yup";

export const EditCorporateLegalNameModalSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
});
