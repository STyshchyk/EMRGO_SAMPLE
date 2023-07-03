import * as Yup from "yup";

export const SellSideSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "First Name is Too Short!")
    .max(50, "First Name is Too Long!")
    .required("First Name is Required"),
  logo: Yup.string().required("File is required")
});
