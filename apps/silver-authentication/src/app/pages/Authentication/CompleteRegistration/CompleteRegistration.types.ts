import { IMFA} from "../../../services";

export interface ICompleteRegistrationProps {}

export interface ICompleteRegistrationContext {
  otpauth_url: string;
  secret: string;
}
