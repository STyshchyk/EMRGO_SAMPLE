import * as Yup from "yup";

const addEquitySecurityFormSchema = Yup.object().shape({
  name: Yup.string().nullable().required("Security Name is required"),
  longName: Yup.string().nullable().required("Long Name is required"),
  shortName: Yup.string().nullable().required("Short Name is required"),
  country: Yup.string().nullable().required("Country is required"),
  currency: Yup.string().nullable().required("Currency is required"),
  status: Yup.string().nullable().required("Status is required"),
  attributes: Yup.array().of(
    Yup.object()
      .shape({
        identifierId: Yup.string().required("Identifier is required"),
        value: Yup.string().required("Security Identifier's value is required"),
      })
      .required("Security Identifier is required")
  ),
});

export default addEquitySecurityFormSchema;
