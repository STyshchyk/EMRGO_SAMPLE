import { userTypes } from "@emrgo-frontend/constants";
import { verifyEmailExists } from "@emrgo-frontend/services";
import * as Yup from "yup";


export const EnterEmailAddressModalSchema = Yup.object().shape({
  email: Yup.string().email().required("Required").test(
    "checkDuplicateEmail",
    "A user with this email id doesn't exist on the platform",
    (value) => {
      return new Promise((resolve) => {
        verifyEmailExists({ email: value, userType: userTypes.EXTERNAL })
          .then(() => {
            resolve(false);
          })
          .catch(() => {
            resolve(true);
          });
      });
    }),
  code: Yup.string().required("Required").length(6),
});