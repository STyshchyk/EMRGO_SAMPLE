import { verifyEmailExists } from "@emrgo-frontend/services";
import * as Yup from "yup";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export const TFASupportTicketModalFormSchema = (userType: string) =>
  Yup.object().shape({
    email: Yup.string()
      .email("Enter valid email")
      .required("Email ID is Required")
      .test(
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
    file: Yup.object()
      .shape({
        name: Yup.string().required(),
        path: Yup.string().required(),
        size: Yup.number().required(),
      })
      .nullable()
      .required("ID Proof is Required")
      .test(
        "fileSize",
        "File size should be less than 1 MB",
        (value) => value && value.size <= MAX_FILE_SIZE_BYTES
      ),
  });
