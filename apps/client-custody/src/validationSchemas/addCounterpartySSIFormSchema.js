import * as Yup from "yup";

const addCounterpartySSIFormSchema = Yup.object().shape({
  entity: Yup.object().shape({
    label:Yup.string(),
    value:Yup.string()
  }).nullable().required("Entity is required"),
  counterparty: Yup.object().shape({    
    label:Yup.string(),
    value:Yup.string()
  }).nullable().required("Counterparty Id is required"),
  ssiLabel: Yup.string().nullable().required("SSI label is required"),
  settlementLocation: Yup.object().shape({
    label:Yup.string(),
    value:Yup.string()
  }).nullable().required("Settlement Location is required"),
  deliveryOrReceiveAgentIdType: Yup.object().shape({
    label:Yup.string(),
    value:Yup.string()
  }).nullable()
    .required("Delivery/Receive Id Type is required"),
  deliveryOrReceiveIdentifier: Yup.string()
    .nullable()
    .required("Delivery/Receive Identifier is required"),
  sellerOrBuyerIdType: Yup.object().shape({
    label:Yup.string(),
    value:Yup.string()
  }).nullable(),
  sellerOrBuyerIdentifier: Yup.string().nullable(),
  safekeepingAccount: Yup.string().nullable(),
});

export default addCounterpartySSIFormSchema;
