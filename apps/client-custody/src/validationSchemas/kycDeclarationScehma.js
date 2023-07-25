import * as Yup from "yup";

const kycDeclarationSchema = Yup.object().shape({
  declarationOfAuthorisation: Yup.boolean(),
  acceptedTnc: Yup.boolean(),
});

export default kycDeclarationSchema;
