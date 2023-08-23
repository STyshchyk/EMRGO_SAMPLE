import * as Yup from "yup";

const addCounterpartyFormSchema = Yup.object().shape({
  entity: Yup.object().nullable().required("Entity is required"),
  counterpartyId: Yup.string().nullable().required("Counterparty Id is required"),
  shortName: Yup.string().nullable().required("Short Name is required"),
  longName: Yup.string().nullable().required("Long Name is required"),
  status: Yup.object().nullable().required("Status is required"),
});

export default addCounterpartyFormSchema;
