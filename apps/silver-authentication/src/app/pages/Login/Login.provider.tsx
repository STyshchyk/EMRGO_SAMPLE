import { createContext, PropsWithChildren, useContext } from "react";

import { ILoginContext } from "./Login.types";

const LoginContext = createContext<ILoginContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the Login template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */
export const LoginProvider = ({ children }: PropsWithChildren) => {
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
  // function sign(req, res) {
  //   res.cookie("access", signed, { maxAge: new JWTService().jwtExpirySeconds * 1000 });
  // }

  const state: ILoginContext = {};

  return <LoginContext.Provider value={state}>{children}</LoginContext.Provider>;
};

export const useLoginContext = () => useContext(LoginContext);
