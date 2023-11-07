import { verifyEmailExists } from "@emrgo-frontend/services";
import * as Yup from "yup";

export const ResetPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Enter valid email")
    .required("Email ID is Required")
    .test(
      "checkIfEmailExists",
      "User with this email id doesn't exist in the platform",
      (value) => {
        return new Promise((resolve) => {
          verifyEmailExists({ email: value, userType: "client" })
            .then(() => {
              // email exists
              resolve(false);
            })
            .catch(() => {
              // email doesnt exist throw error
              resolve(true);
            });
        });
      }
    ),
});
