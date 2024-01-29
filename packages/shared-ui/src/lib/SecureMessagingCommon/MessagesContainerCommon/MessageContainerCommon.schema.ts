import * as Yup from "yup";

export const MessageContainerCommonSchema = Yup.object().shape({
  message: Yup.string().required("Enter message").min(1).max(500),
});
