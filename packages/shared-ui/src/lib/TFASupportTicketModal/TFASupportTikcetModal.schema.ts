import { verifyEmailExists } from "@emrgo-frontend/services";
import * as Yup from "yup";


export const TFASupportTicketModalFormSchema = (userType:string) =>
  Yup.object().shape({
    email: Yup.string().email("Enter valid email").required("Email ID is Required").test(
      "checkIfEmailExists",
      "User with this email id doesn't exist in the platform",
      (value) => {
        return new Promise((resolve) => {
          verifyEmailExists({ email: value, userType }) // Pass userType to your function
            .then(() => {
              // email exists
              resolve(false);
            })
            .catch(() => {
              // email doesn't exist, throw an error
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

