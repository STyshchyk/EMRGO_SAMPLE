import * as Yup from "yup";

const bulletinFormSchema = Yup.object().shape({
  accountId: Yup.string().nullable(),
  documentId: Yup.string().nullable(),
});

export default bulletinFormSchema;
