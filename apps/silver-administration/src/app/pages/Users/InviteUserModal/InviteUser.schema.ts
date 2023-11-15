import { userTypes } from "@emrgo-frontend/constants";
import { verifyEmailExists } from "@emrgo-frontend/services";
import * as Yup from "yup";

export const InviteUserSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(4, "First Name should be 4 or more symbols")
      .max(50, "First Name is Too Long!")
      .required("First Name is Required"),
    lastName: Yup.string()
      .min(4, "Second Name should be 4 or more symbols")
      .max(50, "Second Name is Too Long!")
      .required("Second Name is Required"),
    email: Yup.string()
      .email("Enter valid email")
      .required("Email ID is required")
      .test(
        "checkDuplicateEmail",
        "A user with email ID already exists on the platform",
        (value) => {
          return new Promise((resolve) => {
            verifyEmailExists({ email: value, userType: userTypes.INTERNAL })
              .then(() => {
                // Does not exists
                resolve(true);
              })
              .catch(() => {
                // Entry Exists
                resolve(false);
              });
          });
        }
      ),
    role: Yup.object().required("Select role"),
  });