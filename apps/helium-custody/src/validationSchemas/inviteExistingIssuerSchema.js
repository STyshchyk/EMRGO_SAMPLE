import * as Yup from "yup";

const inviteExistingIssuerSchema = Yup.object().shape({
  issuerGroup: Yup.string().required("Issuer is required"),
});

export default inviteExistingIssuerSchema;
