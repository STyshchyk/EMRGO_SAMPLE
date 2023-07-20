import * as Yup from "yup";

export const AddIssuersModalSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Issuer Name is Too Short!")
    .max(50, "Issuer Name is Too Long!")
    .required("Issuer Name is Required"),
  description: Yup.string()
    .min(2, "Issuer Description is Too Short!")
    .max(50, "Issuer Description is Too Long!")
    .required("Issuer Description is Required"),
  jurisdiction: Yup.string()
    .min(2, "Issuer Jurisdiction is Too Short!")
    .max(50, "Issuer Jurisdiction is Too Long!")
    .required("Issuer Jurisdiction is Required"),
  industry: Yup.string()
    .min(2, "Industry is Too Short!")
    .max(50, "Industry is Too Long!")
    .required("Issuer Jurisdiction is Required"),
});
