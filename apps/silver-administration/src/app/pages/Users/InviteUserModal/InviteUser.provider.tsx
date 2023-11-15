import { createContext, PropsWithChildren, useContext } from "react";

import { FormikHelpers, useFormik } from "formik";

import { InviteUserSchema } from "./InviteUser.schema";
import { IInviteUserContex, IInviteUserValues } from "./InviteUser.types";

const InviteUserContext = createContext<IInviteUserContex | null>(null);


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
