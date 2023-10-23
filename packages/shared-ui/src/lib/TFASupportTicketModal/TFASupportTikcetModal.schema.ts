import { verifyEmailExists } from "@emrgo-frontend/services";
import * as Yup from "yup";


export const TFASupportTicketModalFormSchema = Yup.object().shape({
  email: Yup.string().email("Enter valid email").required("Email ID is Required").test(
    "checkIfEmailExists",
    "User with this email id doesn't exist in the platform",
    (value) => {
      return new Promise((resolve) => {
        verifyEmailExists({ email: value })
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
  file: Yup.object().shape({
    name: Yup.string().required(),
    path: Yup.string().required(),
  }).nullable().required("ID Proof is Required"),
});
