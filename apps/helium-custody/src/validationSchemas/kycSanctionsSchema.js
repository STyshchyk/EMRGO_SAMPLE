import * as Yup from "yup";

const kycSanctionsSchema = Yup.object().shape({
  sanctionsUsedForChild: Yup.boolean(),
});

export default kycSanctionsSchema;
