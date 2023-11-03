import * as Yup from "yup";

const addSafekeepingAccount = Yup.object().shape({
  baseCurrency: Yup.object().required("Base Currency is required"),
  status: Yup.object().required("Status is required"),
  entity: Yup.object().required("Entity is required"),
  name: Yup.string().required("Portfolio Identifier is required"),
});
// entity: foundEntity,
//     baseCurrency: foundCurrency,
//     id: account.id,
//     accountNo: account.securitiesAccount.accountNumber,
//     name: account.name || "",
//     status: foundStatus,
//     currencies: foundCurrencies || [],
export default addSafekeepingAccount;
