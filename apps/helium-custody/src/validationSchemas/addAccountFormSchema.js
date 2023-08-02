import * as Yup from "yup";

const addAccountFormSchema = Yup.object().shape({
  currency: Yup.string(),
  name: Yup.string().required("Full name is required"),
  iban: Yup.string(),
  swift: Yup.string(),
  accountNo: Yup.string(),
  routingNo: Yup.string(),
  sortCode: Yup.string(),
  address1: Yup.string(),
  address2: Yup.string(),
  city: Yup.string(),
  country: Yup.string(),
  postCode: Yup.string(),
  ifscCOde: Yup.string(),
  bsbCode: Yup.string(),
});

export default addAccountFormSchema;
