import * as Yup from "yup";

const addPaymentAccountFormSchema = Yup.object().shape({
  address: Yup.string().required("Address is required"),
  bankName: Yup.string().required("Bank Name is required"),
  city: Yup.string().required("City is required"),
  country: Yup.string().nullable().required("Country is required"),
  currency: Yup.string().nullable().required("Currency is required"),
  entityGroupId: Yup.string().required(),
  iban: Yup.string().required("IBAN is required"),
  label: Yup.string().required("Label is required"),
  name: Yup.string().required("Name is required"),
  postcode: Yup.string().required("Post code is required"),
  swift: Yup.string().required("SWIFT is required"),
  hasIntermediaryBank: Yup.boolean(),
});

export default addPaymentAccountFormSchema;
