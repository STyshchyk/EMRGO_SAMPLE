import * as Yup from "yup";

const onboardingFormSchema = Yup.object().shape({
  firstName: Yup.string().required(),
  middleName: Yup.string(),
  lastName: Yup.string().required(),
  entityEmail: Yup.string().email().required(),
  entityName: Yup.string().required(),
});

export default onboardingFormSchema;
