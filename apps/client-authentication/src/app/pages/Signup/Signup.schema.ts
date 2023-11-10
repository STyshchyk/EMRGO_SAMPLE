import { blacklistedDomains, userTypes } from "@emrgo-frontend/constants";
import { verifyEmailExists, verifyEntityExists } from "@emrgo-frontend/services";
import * as Yup from "yup";

export const SignupSchema = Yup.object().shape({
  firstName: Yup.string().required("Required").max(25, "First Name must not exceed 25 characters"),
  lastName: Yup.string().required("Required").max(25, "Last Name must not exceed 25 characters"),
  entityName: Yup.string()
    .required("Required")
    .max(25, "Entity Name must not exceed 25 characters")
    .test(
      "checkDuplicateEntity",
      "Entity with the same name already exists on the platform",
      (value) => {
        return new Promise((resolve) => {
          verifyEntityExists({ entityName: value })
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
  email: Yup.string()
    .email("Invalid email")
    .required("Required")
    .test(
      "checkDuplicateEmail",
      "A user with the same email id already exists on the platform",
      (value) => {
        return new Promise((resolve) => {
          verifyEmailExists({ email: value, userType: userTypes.EXTERNAL })
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
    )
    .test(
      "checkBusinessEmail",
      "Personal email addresses are not permitted. Please use a business email address",
      (value) => {
        return new Promise((resolve) => {
          const emailDomain = value.split("@")[1];
          blacklistedDomains.forEach((domain) => {
            const regex = new RegExp("^" + domain.split("*").join(".*") + "$"); // replace * with .*
            if (regex.test(emailDomain)) {
              resolve(false);
            }
          });
          resolve(true);
        });
      }
    ),
});
