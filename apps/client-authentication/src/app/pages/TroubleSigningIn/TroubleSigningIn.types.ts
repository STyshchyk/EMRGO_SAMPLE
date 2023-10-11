import { FormikProps } from "formik";

export interface ITroubleSigningInProps {}

export interface ITroubleSigningInContext {
  form: FormikProps<ITroubleSigningInFormValues>;

}


export interface ITroubleSigningInFormValues {
  type:string;
  email: string;
  desc: string;
}