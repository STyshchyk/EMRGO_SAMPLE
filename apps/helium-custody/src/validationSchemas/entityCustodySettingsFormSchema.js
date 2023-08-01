import * as Yup from "yup";

const entityCustodySettingsFormSchema = Yup.object().shape({
  country: Yup.string().nullable().required("Residency is required"),
  baseCurrency: Yup.string().nullable().required("Base Currency is required"),
  portfolioCurrency: Yup.string().nullable().required("Portfolio Currency is required"),
  registrationRequirement: Yup.string().nullable().required("Registration Requirement is required"),
  reportingCycle: Yup.string().nullable().required("Reporting Cycle is required"),
  reportingMode: Yup.string().nullable().required("Reporting Mode is required"),
  specialRequirements: Yup.string().nullable(),
});

export default entityCustodySettingsFormSchema;
