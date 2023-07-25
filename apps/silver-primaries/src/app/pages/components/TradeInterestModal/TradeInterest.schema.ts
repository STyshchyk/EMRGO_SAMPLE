import * as Yup from "yup";

export const tradeInterestSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "First Name is Too Short!")
    .max(50, "First Name is Too Long!")
    .required("First Name is Required"),
  buyside: Yup.object().required("Buyside is required"),
  detail: Yup.string().required("Details is required"),
});
