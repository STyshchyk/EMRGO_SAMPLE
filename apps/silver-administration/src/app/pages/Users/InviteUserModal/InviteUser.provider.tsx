import { createContext, PropsWithChildren, useContext } from "react";

import { FormikHelpers, useFormik } from "formik";
import * as Yup from "yup";

import { IInviteUserContex, IInviteUserValues } from "./InviteUser.types";

const InviteUserContext = createContext<IInviteUserContex | null>(null);

const InviteUserSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(4, "First Name should be 4 or more symbols")
    .max(50, "First Name is Too Long!")
    .required("First Name is Required"),
  lastName: Yup.string()
    .min(4, "Second Name should be 4 or more symbols")
    .max(50, "Second Name is Too Long!")
    .required("Second Name is Required"),
  email: Yup.string().email("Enter valid email").required("Email ID is Required"),
  role: Yup.object().required("Select role"),
});
export const InviteUserProvider = ({ children }: PropsWithChildren) => {
  /**
   *
   * @param values an object containing current form values
   * @returns an object containing errors for each field
   *
   * TODO: Implement this code.
   */

  /**
   * Initial values for the form.
   */
  const initialValues: IInviteUserValues = {
    firstName: "",
    lastName: "",
    role: null,
    email: "",
  };

  /**
   * @param values an object containing current form values
   * @returns void
   *
   * TODO: Implement this code.
   *
   * This function is called when the form is submitted.
   * You can use this function to call an API to create a new user.
   * You can also use this function to navigate to the next page.
   *
   */
  const onSubmit = (values: IInviteUserValues, actions: FormikHelpers<IInviteUserValues>) => {};

  const form = useFormik<IInviteUserValues>({
    initialValues,
    validateOnMount: true,
    validationSchema: InviteUserSchema,
    onSubmit,
  });

  const state: IInviteUserContex = {
    form,
    validationSchema: InviteUserSchema,
  };

  return <InviteUserContext.Provider value={state}>{children}</InviteUserContext.Provider>;
};

export const useInviteUserContext = () => useContext(InviteUserContext);
