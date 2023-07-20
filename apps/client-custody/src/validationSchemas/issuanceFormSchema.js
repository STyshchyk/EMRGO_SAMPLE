import * as Yup from "yup";

const issuanceFormSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  ticker: Yup.string().required("Ticker is required"),
  sukukType: Yup.string(),
  entityId: Yup.string(),
  version: Yup.string(),
  distributionMethod: Yup.string(),
  hasSoftSounding: Yup.boolean(),
  hasRoadShow: Yup.boolean(),
});

export default issuanceFormSchema;
