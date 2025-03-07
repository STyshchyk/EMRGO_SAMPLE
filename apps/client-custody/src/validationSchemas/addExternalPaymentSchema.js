import * as Yup from "yup";

const addExternalPaymentSchema = Yup.object().shape({
  paymentAccount: Yup.object().nullable().required("Payment account is required"),
  paymentAmount: Yup.string().nullable().required("Payment amount is required"),
  paymentDetails: Yup.string().nullable(),
  valueDate: Yup.date().nullable().required("Please select a value date"),
  transferPurpose: Yup.object().nullable().required("Transfer purpose is required"),
});

export default addExternalPaymentSchema;
