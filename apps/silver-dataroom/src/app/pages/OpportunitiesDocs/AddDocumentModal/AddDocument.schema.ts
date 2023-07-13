import * as Yup from "yup"

export const addDocumentSchema = Yup.object({
  docTitle: Yup.string().required(),
  stage: Yup.object().required(),
  file: Yup.string().required(),
})
