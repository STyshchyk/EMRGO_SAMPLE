import { IMFA } from "~/services/MFA/MFA";

export interface ICompleteRegistrationProps {}

export interface ICompleteRegistrationContext {
  otpauth_url: string;
  secret: string;
}
