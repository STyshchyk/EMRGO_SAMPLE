import * as Yup from "yup";

const lcClosingFormSchema = Yup.object().shape({
  hasDueDiligence: Yup.boolean().oneOf([true], "Due Diligence is required"),
  hasConditionsPrecedent: Yup.boolean().oneOf([true], "Conditions Precendent is required"),
});

export default lcClosingFormSchema;
