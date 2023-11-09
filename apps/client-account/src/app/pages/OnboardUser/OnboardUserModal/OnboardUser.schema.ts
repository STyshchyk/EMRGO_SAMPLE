import { blacklistedDomains } from "@emrgo-frontend/constants";
import * as Yup from "yup";

export const onboardUserSchema = Yup.object().shape({
  firstName: Yup.string()
    // .min(4, "First Name should be 4 or more symbols")
    .max(50, "First Name is Too Long!")
    .required("First Name is Required"),
  lastName: Yup.string()
    // .min(4, "Last Name should be 4 or more symbols")
    .max(50, "Last Name is Too Long!")
    .required("Last Name is Required"),
  email: Yup.string().email("Enter valid email").required("Email ID is Required").test(
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
  roles: Yup.array().required("Select role"),
});
