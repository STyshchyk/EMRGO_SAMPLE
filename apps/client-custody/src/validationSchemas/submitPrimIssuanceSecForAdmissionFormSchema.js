import * as Yup from "yup";

const submitPrimIssuanceSecForAdmissionFormSchema = Yup.object({
  csdSelectOption: Yup.object().nullable().required(),
});

export default submitPrimIssuanceSecForAdmissionFormSchema;
