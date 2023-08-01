import * as Yup from "yup";

const kycTermsSchema = Yup.object().shape({
  tncAcceptanceStatus: Yup.boolean(),
});

export default kycTermsSchema;
