import * as Yup from "yup";

const clientTermsFormSchema = Yup.object().shape({
  acceptTerms: Yup.boolean().oneOf([true]),
  // w8_ben: Yup.mixed().required('W8 Ben File is required'),
  // board_resolution: Yup.mixed().required('Board Resolution File is required'),
});

export default clientTermsFormSchema;
