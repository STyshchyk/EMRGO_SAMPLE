import * as Yup from "yup";

const projectSetupFormSchema = Yup.object().shape({
  clientEmail: Yup.object().shape({
    value: Yup.string().email().required("Client Email is required"),
  }),
  name: Yup.string().max(128).required("Project Name is required"),
  projectType: Yup.string().max(128).required("Project Type is required"),
  // sukukType: Yup.string()
  //   .max(128)
  //   .required('Sukuk Type is required'),
});

export default projectSetupFormSchema;
