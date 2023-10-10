import * as Yup from "yup";

export const TroubleSigningInSchema = Yup.object().shape({
  email: Yup.string().email().required("Required"),
  desc: Yup.string().required("Required"),
});


