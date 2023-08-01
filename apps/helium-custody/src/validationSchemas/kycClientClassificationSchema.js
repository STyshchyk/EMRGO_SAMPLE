import * as Yup from "yup";

const kycClientClassificationSchema = Yup.object().shape({
  tncAcceptanceStatus: Yup.boolean(),
});

export default kycClientClassificationSchema;
