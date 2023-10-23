import * as Yup from "yup";

const addCorporateActionEventFormSchema = Yup.object().shape({
  eventType: Yup.object().shape({
    label:Yup.string(),
    value:Yup.string()
  }).nullable().required("Event Type is required"),
  // externalSecuritySelectOption: Yup.object().required(),
  externalSecuritySelectOption: Yup.object().shape({
    label:Yup.string(),
    value:Yup.object()
  }).nullable().required("Security ISIN is required"),
  exDate: Yup.date().nullable().required("Ex Date is required"),
  recordDate: Yup.date().nullable().required("Record Date is required"),
  paymentDate: Yup.date().nullable().required("Payment Date is required"),
  eventStatus: Yup.object().shape({
    label:Yup.string(),
    value:Yup.string()
  }).nullable().required("Event Status is required"),
  eventTerms: Yup.string().nullable().required("Event Term is required"),
  mandatoryOrVoluntary: Yup.object().shape({
    label:Yup.string().nullable(),
    value:Yup.string().nullable()
  }).nullable().required("Voluntary/Mandatory is required"),
  // responseDeadline: Yup.date().nullable().required("Response Deadline is required"),
  responseDeadline: Yup.date().when('mandatoryOrVoluntary.value', {
    is: (value) => value === 'voluntary',
    then: () => Yup.date().nullable().required('Response Deadline is required'),
    otherwise: () => Yup.date().nullable(),
  }),
});

export default addCorporateActionEventFormSchema;