import * as Yup from "yup";

const addEntityAccountFormSchema = Yup.object().shape({
  iban: Yup.string()
    .required('The IBAN field is required')
    .min(13, 'The IBAN must be at least 13 characters')
    .max(34, 'The IBAN cannot exceed 34 characters'),
  isVirtualIBAN: Yup.boolean(),
});

export default addEntityAccountFormSchema;
