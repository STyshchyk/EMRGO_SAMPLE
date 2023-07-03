import { blacklistedDomains } from "@emrgo-frontend/constants";
import * as Yup from "yup";

export const EditEmailAddressModalSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Required")
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
